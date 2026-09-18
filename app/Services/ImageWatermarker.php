<?php

namespace App\Services;

class ImageWatermarker
{
    protected string $text = 'SUDDENLY CREATIVE';

    protected string $fontPath;

    public function __construct()
    {
        $this->fontPath = storage_path('fonts/inter.ttf');
    }

    /**
     * Load the image at $path, tile a diagonal watermark across it, and
     * overwrite $path with the result. Returns true on success.
     */
    public function apply(string $path): bool
    {
        $image = $this->load($path);

        if (! $image) {
            return false;
        }

        $width = imagesx($image);
        $height = imagesy($image);

        imagealphablending($image, true);

        $fontSize = max(12, (int) round(min($width, $height) * 0.035));
        $angle = -28;
        $color = imagecolorallocatealpha($image, 255, 255, 255, 118);

        $box = imagettfbbox($fontSize, $angle, $this->fontPath, $this->text);
        $textWidth = abs($box[4] - $box[0]);
        $textHeight = abs($box[5] - $box[1]);

        $stepX = $textWidth + $fontSize * 6;
        $stepY = $textHeight + $fontSize * 4;

        for ($y = -$stepY; $y < $height + $stepY; $y += $stepY) {
            for ($x = -$stepX; $x < $width + $stepX; $x += $stepX) {
                imagettftext($image, $fontSize, $angle, (int) $x, (int) $y, $color, $this->fontPath, $this->text);
            }
        }

        return $this->save($image, $path);
    }

    protected function load(string $path)
    {
        $mime = mime_content_type($path);

        return match ($mime) {
            'image/jpeg' => imagecreatefromjpeg($path),
            'image/png' => imagecreatefrompng($path),
            default => null,
        };
    }

    protected function save($image, string $path): bool
    {
        $mime = mime_content_type($path);

        $result = match ($mime) {
            'image/jpeg' => imagejpeg($image, $path, 88),
            'image/png' => imagepng($image, $path),
            default => false,
        };

        imagedestroy($image);

        return $result;
    }
}
