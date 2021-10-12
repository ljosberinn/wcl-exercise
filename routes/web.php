<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// routing happens through react-router-dom in the frontend
Route::view('/{any}', 'app')->where('any', '.*');
