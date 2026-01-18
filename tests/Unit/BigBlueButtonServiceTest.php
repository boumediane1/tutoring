<?php

use App\Services\BigBlueButtonService;
use Illuminate\Support\Facades\Config;

uses(Tests\TestCase::class);

it('can be instantiated when config is present', function () {
    Config::set('bigbluebutton.server_base_url', 'http://example.com/bigbluebutton/');
    Config::set('bigbluebutton.security_salt', 'secret-salt');

    $service = new BigBlueButtonService;

    expect($service)->toBeInstanceOf(BigBlueButtonService::class);
});

it('uses test defaults in testing environment if config is empty', function () {
    Config::set('bigbluebutton.server_base_url', null);
    Config::set('bigbluebutton.security_salt', null);
    Config::set('app.env', 'testing');

    $service = new BigBlueButtonService;

    expect($service)->toBeInstanceOf(BigBlueButtonService::class);
});
