#!/bin/sh
set -e

# Cache configuration, routes, and views if APP_KEY is set
if [ ! -z "$APP_KEY" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    # php artisan migrate --force
fi

exec "$@"
