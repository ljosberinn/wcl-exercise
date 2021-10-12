<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

const WCL_ENDPOINT = 'https://www.warcraftlogs.com/v1';

Route::prefix('wcl')->group(function () {
    Route::get('/latest-parse/{region}/{realm}/{character}', function (string $region, string $realm, string $character) {
        $client = new Client();

        $path = implode('/', [WCL_ENDPOINT, 'parses', 'character', $character, $realm, $region]);

        try {
            $response = $client->get($path, [
                'query' => [
                    'includeCombatantInfo' => true,
                    'api_key' => config('app.wcl_key')
                ]
            ]);

            $allParses = json_decode($response->getBody()->__toString(), true);

            if (empty($allParses)) {
                return response(['error' => 'No parse found'], 404);
            }

            $latestParse = array_reduce($allParses, fn ($carry, $item) => $carry === null ? $item : ($item['startTime'] >= $carry['startTime'] ? $item : $carry), null);

            if ($latestParse === null) {
                return response(['error' => 'No parse found'], 404);
            }

            function normalizeGem(array $gem): array
            {
                $gem['id'] = (int) $gem['id'];
                $gem['itemLevel'] = (int) $gem['itemLevel'];
                return $gem;
            }

            function normalizeBonusIDs(string $id): int
            {
                return (int) $id;
            }

            $enchants = ['permanentEnchant', 'temporaryEnchant', 'onUseEnchant'];

            return response([
                'meta' => [
                    'fightID' => $latestParse['fightID'],
                    'reportID' => $latestParse['reportID'],
                ],
                'encounter' => [
                    'name' => $latestParse['encounterName'],
                    'rank' => $latestParse['rank'],
                    'outOf' => $latestParse['outOf'],
                    'percentile' => $latestParse['percentile']
                ],
                'combatant' => [
                    'conduitPowers' => $latestParse['conduitPowers'],
                    'soulbindPowers' => $latestParse['soulbindPowers'],
                    'legendaryEffects' => $latestParse['legendaryEffects'],
                    'talents' => $latestParse['talents'],
                    'realm' => $latestParse['server'],
                    'region' => $region,
                    'name' => $character,
                    'itemLevel' => $latestParse['ilvlKeyOrPatch'],
                    'gear' => array_values(
                        // normalize types
                        array_map(function ($item) use ($enchants) {
                            $item['id'] = (int) $item['id'];

                            foreach ($enchants as $enchant) {
                                if (array_key_exists($enchant, $item)) {
                                    $item[$enchant] = (int) $item[$enchant];
                                }
                            }

                            if (array_key_exists('gems', $item)) {
                                $item['gems'] = array_map("normalizeGem", $item['gems']);
                            }

                            if (array_key_exists('bonusIDs', $item)) {
                                $item['bonusIDs'] = array_map("normalizeBonusIDs", $item['bonusIDs']);
                            }

                            unset($item['temporaryEnchant']);
                            unset($item['onUseEnchant']);

                            return $item;
                            // drop unknown items
                        }, array_filter($latestParse['gear'], fn ($dataset) => $dataset['id'] !== 0))
                    ),
                    'class' => $latestParse['class'],
                    'spec' => $latestParse['spec'],
                ],
            ], 200, [
                'Cache-Control' => 'public, max-age=180, s-maxage=180, stale-while-revalidate=180'
            ]);
        } catch (ClientException $error) {
            // surface api error directly
            $errorMsg = json_decode($error->getResponse()->getBody()->__toString(), true);

            return response(
                [
                    'error' => $errorMsg['error']
                ],
                $errorMsg['status']
            );
        }
    });
});
