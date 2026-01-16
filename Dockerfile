# Stage 1: PHP Dependencies
FROM composer:latest AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader

# Stage 2: Frontend Assets
FROM node:22-alpine AS frontend

RUN apk add --no-cache \
    php \
    php-ctype \
    php-curl \
    php-dom \
    php-fileinfo \
    php-mbstring \
    php-openssl \
    php-phar \
    php-session \
    php-tokenizer \
    php-xml \
    php-xmlwriter \
    php-pdo \
    php-pdo_pgsql \
    php-bcmath \
    php-gd \
    php-zip \
    php-intl

WORKDIR /app
COPY --from=vendor /app/vendor ./vendor
COPY package.json package-lock.json ./
#RUN npm ci --omit=dev
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Final Image
FROM php:8.4-fpm-alpine

# Install runtime libraries and build PHP extensions
RUN apk add --no-cache \
        postgresql-libs \
        libpng \
        libzip \
        icu-libs \
    && apk add --no-cache --virtual .build-deps \
        postgresql-dev \
        libpng-dev \
        libzip-dev \
        icu-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

WORKDIR /var/www/html

# Copy only necessary application files
COPY --chown=www-data:www-data app ./app
COPY --chown=www-data:www-data bootstrap ./bootstrap
COPY --chown=www-data:www-data config ./config
COPY --chown=www-data:www-data database ./database
COPY --chown=www-data:www-data public ./public
COPY --chown=www-data:www-data resources ./resources
COPY --chown=www-data:www-data routes ./routes
COPY --chown=www-data:www-data storage ./storage
COPY --chown=www-data:www-data artisan ./artisan
COPY --chown=www-data:www-data composer.json ./composer.json

# Copy dependencies from previous stages
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=frontend --chown=www-data:www-data /app/public/build ./public/build

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
EXPOSE 9000
CMD ["php-fpm"]
