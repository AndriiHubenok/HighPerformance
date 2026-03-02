FROM orangehrm/orangehrm:4.10.1

# add multi tenant addon
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY ./OrangeHRM-MT/symfony /var/www/html/symfony
RUN composer install -d symfony/lib \
    && composer dump-autoload -o -d symfony/lib

# add wait script to wait for database availability
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
ENV WAIT_HOSTS=mariadb:3306

# install mariadb to load db dump afterwards
RUN apt-get update \
    && apt-get install -y mariadb-client

# add swagger-ui / configure apache accordingly
COPY ./swagger-ui /var/www/swagger-ui
COPY ./000-default.conf /etc/apache2/sites-available/

# add db dump, OrangeHRM config and initialization script
COPY ./export.sql /
COPY ./config.ini /var/www/html/installer/
COPY ./init.sh /