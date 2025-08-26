<?php

use Symfony\Component\Finder\Finder;

arch()->preset()->php()->ignoring(['dd', 'dump']);

arch()->preset()->laravel();
arch()->preset()->relaxed();
arch()->preset()->security()->ignoring(['array_rand', 'parse_str', 'mt_rand', 'uniqid', 'sha1']);

arch('annotations')
    ->expect('App')
    ->toUseStrictEquality()
    ->toHavePropertiesDocumented()
    ->toHaveMethodsDocumented();

arch('allow Laravel Feature tests')
    ->expect(function () {
        $finder = Finder::create()
            ->in(['tests/Feature', 'tests/Unit'])
            ->files()
            ->name('*.php');

        $allowedFiles = [];
        foreach ($finder as $file) {
            $content = file_get_contents($file->getRealPath());
            // Allow Laravel feature tests that extend our TestCase
            if (preg_match('/class\s+\w+\s+extends\s+(Tests\\\\)?TestCase/', $content) && 
                (strpos($content, 'use RefreshDatabase') !== false || 
                 strpos($content, 'Feature\\') !== false || 
                 strpos($content, 'Unit\\') !== false)) {
                $allowedFiles[] = $file->getRealPath();
            }
        }

        return $allowedFiles;
    })
    ->toBeArray(); // Allow our Laravel feature tests
