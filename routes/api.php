<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use GuzzleHttp\Client;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//https://www.warcraftlogs.com/parses/character/Xepheris/Blackmoore/eu?includeCombatantInfo=1&api_key=6e7efd712c76d48894f855c98dd00a10
const WCL_ENDPOINT = 'https://www.warcraftlogs.com/v1';

Route::prefix('wcl')->group(function () {
    Route::get('/latest-parse/{region}/{realm}/{character}', function (Request $request, string $region, string $realm, string $character) {
        $client = new Client();

        $path = implode('/', ['https://www.warcraftlogs.com/v1', 'parses', 'character', $character, $realm, $region]);


        $response = $client->get($path, [
            'query' => [
                'includeCombatantInfo' => true,
                'api_key' => config('app.wcl_key')
            ]
        ]);

        return $response->getBody();
    });
});
