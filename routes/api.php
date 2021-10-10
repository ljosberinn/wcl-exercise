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

            return [
                'meta' => [
                    'fightID' => $latestParse['fightID'],
                    'reportID' => $latestParse['reportID'],
                    'startTime' => $latestParse['startTime'],
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
                    'server' => $latestParse['server'],
                    'itemLevel' => $latestParse['ilvlKeyOrPatch'],
                    // normalize types
                    'gear' => array_map(function ($item) use ($enchants) {
                        $item['itemLevel'] = (int) $item['itemLevel'];
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

                        unset($item['quality']);

                        return $item;
                        // drop unknown items
                    }, array_filter($latestParse['gear'], fn ($dataset) => $dataset['id'] !== 0)),
                    'class' => $latestParse['class'],
                    'spec' => $latestParse['spec'],
                ],
            ];
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
