<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsPage extends Model
{
    use HasFactory;

    protected $table = 'cms_pages';

    protected $fillable = [
        'title',
        'slug',
        'category',
        'menu_label',
        'route_path',
        'meta_description',
        'content_blocks',
        'status',
        'last_edited_by',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'content_blocks' => 'array',
        ];
    }
}
