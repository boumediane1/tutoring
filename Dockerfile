# Stage 1: PHP Dependencies
FROM composer:latest AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --no-dev \
    --prefer-dist

# Stage 2: Frontend Assets
FROM node:22-alpine AS frontend

# Install PHP for Wayfinder
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
RUN npm install
COPY . .
RUN npm run build

# Stage 3: Final Image
FROM php:8.4-fpm-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    icu-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql bcmath gd zip opcache intl

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# Copy dependencies from previous stages
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]

EXPOSE 9000

CMD ["php-fpm"]
