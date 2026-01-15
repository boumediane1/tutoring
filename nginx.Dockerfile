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

# Stage 2: Build assets
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

# Stage 3: Final Nginx image
FROM nginx:stable-alpine

# Copy custom configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy public assets from the app (including built ones)
COPY --from=frontend /app/public /var/www/html/public

WORKDIR /var/www/html
