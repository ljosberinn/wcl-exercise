## Requirements

-   PHP 8.0+
-   Node.js
-   composer

## Setup

-   run `composer install`
-   run `yarn` (or `npm i`)
-   edit `.env` and enter your WCL API Key
-   ensure you have a valid `cacert.pem` in your `php.ini` [read more](https://github.com/guzzle/guzzle/issues/1935#issuecomment-371756738)
-   run `yarn dev` to compile frontend assets or `yarn watch-poll` to start a watcher listening on changes
-   run `php artisan serve` to start the backend
