## Requirements

-   PHP 8.0+ with `ext-fileinfo` enabled
-   Node.js
-   composer

## Setup

-   run `composer install`
-   run `php artisan key:generate`
-   run `yarn` (or `npm i`)
-   run `cp .env.example .env`, then edit `.env` and enter your WCL API Key
-   ensure you have a valid `cacert.pem` in your `php.ini` [read more](https://github.com/guzzle/guzzle/issues/1935#issuecomment-371756738)
-   run `yarn dev` to compile frontend assets or `yarn watch-poll` to start a watcher listening on changes
-   run `php artisan serve` to start the backend

## Known bugs

-   `<LoadingHourglass />` doesn't always display on index route when loading character info
