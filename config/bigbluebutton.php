<?php

return [

    /*
    |--------------------------------------------------------------------------
    | BigBlueButton Server Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure the server URL and security salt for your
    | BigBlueButton integration.
    |
    */

    'server_base_url' => env('BBB_SERVER_BASE_URL'),

    'security_salt' => env('BBB_SECURITY_SALT'),

];
