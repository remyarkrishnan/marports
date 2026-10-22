<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @php
        $roleTitle = (!empty($speaker['role']) && str_contains(strtolower($speaker['role']), 'advisory')) ? 'Advisory Board Bio' : 'Speaker Bio';
    @endphp
    <title>{{ $speaker['name'] }} - {{ $roleTitle }}</title>
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}">
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}">

    <style>
        :root {
            --primary: #0A1E3F;
            --primary-light: #0E4B75;
            --gold: #D9A441;
            --gold-light: #F0D9A0;
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --bg-light: #f8fafc;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f1f5f9;
            color: var(--text-dark);
            line-height: 1.7;
            padding: 24px;
        }

        .bio-container {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(10, 30, 63, 0.08);
            border: 1px solid rgba(217, 164, 65, 0.25);
            overflow: hidden;
        }

        .no-print-bar {
            background: #0A1E3F;
            padding: 14px 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(217, 164, 65, 0.3);
        }

        .btn-print {
            background: linear-gradient(135deg, #D9A441, #F0D9A0);
            color: #0A1E3F;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 8px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }

        .btn-print:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        .btn-close {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 13px;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
        }

        .btn-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .bio-header {
            background: linear-gradient(135deg, #0A1E3F 0%, #0E4B75 100%);
            padding: 36px 36px 32px;
            color: #ffffff;
            position: relative;
        }

        .event-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #F0D9A0;
            background: rgba(217, 164, 65, 0.15);
            border: 1px solid rgba(217, 164, 65, 0.35);
            padding: 4px 12px;
            border-radius: 9999px;
            margin-bottom: 20px;
        }

        .profile-row {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .speaker-photo {
            width: 110px;
            height: 110px;
            border-radius: 16px;
            object-fit: cover;
            border: 3px solid #D9A441;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
            background: #0E4B75;
            flex-shrink: 0;
        }

        .speaker-intro {
            flex: 1;
        }

        .speaker-role {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #D9A441;
            margin-bottom: 4px;
        }

        .speaker-name {
            font-family: "Georgia", "Times New Roman", Times, "Palatino", serif;
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            line-height: 1.25;
            margin-bottom: 8px;
            letter-spacing: 0.02em;
        }

        .speaker-designation {
            font-size: 14px;
            font-weight: 600;
            color: #F0D9A0;
            margin-bottom: 4px;
        }

        .speaker-company {
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.85);
        }

        .linkedin-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 12px;
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            background: #0077b5;
            padding: 5px 12px;
            border-radius: 6px;
            text-decoration: none;
            transition: opacity 0.2s;
        }

        .linkedin-badge:hover {
            opacity: 0.9;
        }

        .bio-body {
            padding: 36px;
            background: #ffffff;
        }

        .section-title {
            font-family: "Georgia", "Times New Roman", Times, "Palatino", serif;
            font-size: 15px;
            font-weight: 700;
            color: #0A1E3F;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(217, 164, 65, 0.3);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .bio-text {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            color: #334155;
            line-height: 1.75;
            white-space: pre-line;
            text-align: left;
            letter-spacing: normal;
            word-spacing: normal;
        }

        .bio-footer {
            padding: 20px 36px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #64748b;
        }

        .bio-footer strong {
            color: #0A1E3F;
        }

        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            body, * {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            .speaker-name, .section-title {
                font-family: "Georgia", "Times New Roman", Times, serif !important;
                letter-spacing: 0.04em !important;
            }
            body {
                background: #ffffff !important;
                padding: 0 !important;
            }
            .no-print-bar {
                display: none !important;
            }
            .bio-container {
                box-shadow: none !important;
                border: 1px solid #cbd5e1 !important;
                border-radius: 0 !important;
                max-width: 100% !important;
                margin: 0 !important;
            }
            .bio-header {
                background: #0A1E3F !important;
            }
            .bio-body {
                padding: 24px !important;
            }
            .bio-text {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                font-size: 13px !important;
                line-height: 1.65 !important;
                text-align: left !important;
                letter-spacing: normal !important;
                word-spacing: normal !important;
            }
        }
    </style>
</head>
<body>

    <div class="bio-container">
        <!-- Floating Print Bar for Screen Mode -->
        <div class="no-print-bar">
            <span style="color: #F0D9A0; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
                MARPORTS GLOBAL 2027 • Executive Bio
            </span>
            <div style="display: flex; gap: 10px; align-items: center;">
                @if(!empty($speaker['bio_file']))
                    <a href="{{ asset(ltrim($speaker['bio_file'], '/')) }}" target="_blank" download class="btn-close" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;" title="Download Attached Bio Document">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Attached File
                    </a>
                @endif
                <button class="btn-print" onclick="window.print()" title="Download or print this formatted executive bio">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Bio (Save as PDF)
                </button>
                <button class="btn-close" onclick="window.close()">Close</button>
            </div>
        </div>

        <!-- Header Card -->
        <div class="bio-header">
            <div class="event-badge">
                <span>MARPORTS GLOBAL 2027</span>
                <span>•</span>
                <span>5 FEB 2027 • CHENNAI</span>
            </div>

            <div class="profile-row">
                @if(!empty($speaker['image']))
                    <img src="{{ asset(ltrim($speaker['image'], '/')) }}" alt="{{ $speaker['name'] }}" class="speaker-photo">
                @else
                    <div class="speaker-photo" style="display:flex;align-items:center;justify-content:center;color:#F0D9A0;font-size:24px;font-weight:700;font-family:'Georgia',serif;">
                        {{ substr($speaker['name'], 0, 2) }}
                    </div>
                @endif
                <div class="speaker-intro">
                    <div class="speaker-role">{{ $speaker['role'] ?? 'Speaker' }}</div>
                    <h1 class="speaker-name">{{ $speaker['name'] }}</h1>
                    <div class="speaker-designation">{{ $speaker['designation'] ?? '' }}</div>
                    <div class="speaker-company">{{ $speaker['company'] ?? '' }}</div>

                    @if(!empty($speaker['linkedin']))
                        <a href="{{ $speaker['linkedin'] }}" target="_blank" rel="noopener noreferrer" class="linkedin-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            LinkedIn Profile
                        </a>
                    @endif
                </div>
            </div>
        </div>

        <!-- Bio Body -->
        <div class="bio-body">
            <div class="section-title">
                <span>Executive Biography</span>
                <span style="font-size: 11px; font-weight: 600; color: #D9A441; text-transform: uppercase;">Official Profile</span>
            </div>
            @php
                $bioText = $speaker['bio'] ?? '';
                if (str_contains($bioText, 'E X E C R I V E') || str_contains($bioText, 'Kunma\ SampamPi') || str_contains($bioText, 'O F F I C I A L P / O F I L E')) {
                    $bioText = !empty($speaker['description']) ? $speaker['description'] : '';
                }
                if (empty($bioText)) {
                    $bioText = !empty($speaker['description']) ? $speaker['description'] : 'Executive biography details will be announced shortly.';
                }
            @endphp
            <div class="bio-text">{{ $bioText }}</div>
        </div>

        <!-- Footer -->
        <div class="bio-footer">
            <div>
                <strong>MARPORTS GLOBAL 2027</strong> | Organized by <strong>E Hub Events Private Limited</strong>
            </div>
            <div>
                Taj Coromandel, Chennai • 5 February 2027
            </div>
        </div>
    </div>

    <script>
        function triggerAutoPrint() {
            // Give browser time to finish laying out all elements and images
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function() {
                    setTimeout(function() {
                        window.print();
                    }, 350);
                }).catch(function() {
                    setTimeout(function() {
                        window.print();
                    }, 350);
                });
            } else {
                setTimeout(function() {
                    window.print();
                }, 500);
            }
        }

        window.addEventListener('load', function() {
            // Automatically prompt print dialog if print=1 or triggered from Download Bio
            if (window.location.search.includes('print=1') || window.location.hash === '#print') {
                triggerAutoPrint();
            }
        });
    </script>
</body>
</html>
