<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

trait ExtractsBioContent
{
    /**
     * Extract plain text biography content from an uploaded file (DOCX, PDF, TXT).
     */
    protected function extractBioContent(string $filePath): string
    {
        if (! file_exists($filePath)) {
            return '';
        }

        try {
            $extracted = match ($extension) {
                'txt' => $this->extractFromTxt($filePath),
                'docx' => $this->extractFromDocx($filePath),
                'pdf' => $this->extractFromPdf($filePath),
                default => '',
            };

            return $this->isValidBioText($extracted) ? $extracted : '';
        } catch (\Throwable $e) {
            Log::warning("ExtractsBioContent: could not extract text from [{$filePath}]: {$e->getMessage()}");

            return '';
        }
    }

    /**
     * Validate that extracted text represents clean readable biography content
     * and not corrupted glyph-stream garbage or PDF binary noise.
     */
    protected function isValidBioText(string $text): bool
    {
        $text = trim($text);
        if (strlen($text) < 15) {
            return false;
        }

        // Known corrupted print artifact signatures
        if (str_contains($text, 'E X E C R I V E') ||
            str_contains($text, 'O F F I C I A L P / O F I L E') ||
            str_contains($text, 'Kunma\ SampamPi') ||
            str_contains($text, 'L A / P O / R S')) {
            return false;
        }

        // Check for binary control characters
        if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $text)) {
            return false;
        }

        // Check for spaced-out single characters (e.g. "D r . K u n m a \ S a m p a m P i")
        $words = preg_split('/\s+/', $text);
        if (count($words) >= 10) {
            $singleCharCount = 0;
            foreach ($words as $w) {
                if (mb_strlen($w) === 1) {
                    $singleCharCount++;
                }
            }
            if (($singleCharCount / count($words)) > 0.40) {
                return false;
            }
        }

        return true;
    }

    /**
     * Extract text from plain text file.
     */
    protected function extractFromTxt(string $filePath): string
    {
        $content = file_get_contents($filePath);
        if ($content === false) {
            return '';
        }

        $encoding = mb_detect_encoding($content, ['UTF-8', 'ASCII', 'ISO-8859-1', 'Windows-1252'], true);
        if ($encoding && $encoding !== 'UTF-8') {
            $content = mb_convert_encoding($content, 'UTF-8', $encoding);
        }

        return trim($content);
    }

    /**
     * Extract text from Microsoft Word (.docx) XML structure.
     */
    protected function extractFromDocx(string $filePath): string
    {
        $zip = new \ZipArchive;
        if ($zip->open($filePath) !== true) {
            return '';
        }

        $xml = $zip->getFromName('word/document.xml');
        $zip->close();

        if (! $xml) {
            return '';
        }

        // Convert paragraph and break tags into newlines
        $xml = str_replace(
            ['</w:p>', '</w:br>', '<w:br/>', '<w:cr/>'],
            ["\n\n", "\n", "\n", "\n"],
            $xml
        );

        $text = strip_tags($xml);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
        $text = str_replace(["\xc2\xa0", '&nbsp;'], ' ', $text);

        // Clean up whitespace
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n{3,}/', "\n\n", $text);

        return trim($text);
    }

    /**
     * Extract text from PDF streams including CMap glyph translation.
     */
    protected function extractFromPdf(string $filePath): string
    {
        $content = file_get_contents($filePath);
        if (! $content) {
            return '';
        }

        // 1. Build ToUnicode CMap lookup table
        $cmap = [];
        preg_match_all('/stream[\r\n]+(.*?)[\r\n]+endstream/s', $content, $streamMatches);

        foreach ($streamMatches[1] as $rawStream) {
            $decompressed = @gzuncompress($rawStream);
            if ($decompressed === false) {
                continue;
            }

            if (str_contains($decompressed, 'beginbfchar') || str_contains($decompressed, 'beginbfrange')) {
                // Range mappings: <start> <end> <target>
                if (preg_match_all('/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>/', $decompressed, $rangeMatches, PREG_SET_ORDER)) {
                    foreach ($rangeMatches as $rm) {
                        $start = hexdec($rm[1]);
                        $end = hexdec($rm[2]);
                        $target = hexdec($rm[3]);
                        for ($i = $start; $i <= $end; $i++) {
                            $code = strtoupper(str_pad(dechex($i), 4, '0', STR_PAD_LEFT));
                            $cmap[$code] = mb_chr($target + ($i - $start), 'UTF-8');
                        }
                    }
                }
                // Single mappings: <source> <target>
                if (preg_match_all('/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>/', $decompressed, $charMatches, PREG_SET_ORDER)) {
                    foreach ($charMatches as $cm) {
                        $code = strtoupper($cm[1]);
                        $target = hexdec($cm[2]);
                        $cmap[$code] = mb_chr($target, 'UTF-8');
                    }
                }
            }
        }

        // 2. Parse text content streams
        $extractedBlocks = [];

        foreach ($streamMatches[1] as $rawStream) {
            $decompressed = @gzuncompress($rawStream);
            if ($decompressed === false) {
                $decompressed = $rawStream;
            }

            if (! str_contains($decompressed, 'BT') && ! str_contains($decompressed, 'Tj') && ! str_contains($decompressed, 'TJ')) {
                continue;
            }

            preg_match_all('/BT\s*(.*?)\s*ET/s', $decompressed, $btBlocks);
            $blocksToScan = ! empty($btBlocks[1]) ? $btBlocks[1] : [$decompressed];

            foreach ($blocksToScan as $block) {
                $blockText = '';

                // Handle kerning/positioning array TJ operator: [ (str) 10 (str2) ] TJ or [ <0024> -10 <0025> ] TJ
                if (preg_match_all('/\[(.*?)\]\s*TJ/s', $block, $tjMatches)) {
                    foreach ($tjMatches[1] as $arrayContent) {
                        preg_match_all('/\((.*?)(?<!\\\\)\)|<([0-9a-fA-F]+)>/s', $arrayContent, $parts, PREG_SET_ORDER);
                        $lineStr = '';
                        foreach ($parts as $p) {
                            if (isset($p[1]) && $p[1] !== '') {
                                $lineStr .= stripslashes($p[1]);
                            } elseif (isset($p[2]) && $p[2] !== '') {
                                $hex = $p[2];
                                for ($i = 0; $i < strlen($hex); $i += 4) {
                                    $code = strtoupper(substr($hex, $i, 4));
                                    $lineStr .= $cmap[$code] ?? '';
                                }
                            }
                        }
                        if (trim($lineStr) !== '') {
                            $blockText .= $lineStr.' ';
                        }
                    }
                }

                // Handle single string Tj operator: (str) Tj
                if (preg_match_all('/\((.*?)(?<!\\\\)\)\s*Tj/s', $block, $tjMatches)) {
                    foreach ($tjMatches[1] as $raw) {
                        $blockText .= stripslashes($raw).' ';
                    }
                }

                // Handle single hex Tj operator: <0041> Tj
                if (preg_match_all('/<([0-9a-fA-F]+)>\s*Tj/s', $block, $hexMatches)) {
                    foreach ($hexMatches[1] as $hex) {
                        $str = '';
                        for ($i = 0; $i < strlen($hex); $i += 4) {
                            $code = strtoupper(substr($hex, $i, 4));
                            $str .= $cmap[$code] ?? '';
                        }
                        if (trim($str) !== '') {
                            $blockText .= $str.' ';
                        }
                    }
                }

                $clean = trim($blockText);
                if (! empty($clean) && strlen($clean) > 5) {
                    $extractedBlocks[] = $clean;
                }
            }
        }

        $result = implode("\n\n", $extractedBlocks);
        $result = str_replace(["\xc2\xa0", '&nbsp;'], ' ', $result);
        $result = preg_replace('/[ \t]+/', ' ', $result);
        $result = preg_replace('/\n{3,}/', "\n\n", $result);

        return trim($result);
    }
}
