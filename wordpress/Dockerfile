FROM wordpress:php8.3-apache

# wp-cli for entrypoint init
RUN curl -sSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
      -o /usr/local/bin/wp \
    && chmod +x /usr/local/bin/wp

COPY entrypoint.sh /usr/local/bin/twl-entrypoint.sh
RUN chmod +x /usr/local/bin/twl-entrypoint.sh

# Wrap the official entrypoint: WP core boot first, then our init runs in the background.
ENTRYPOINT ["/usr/local/bin/twl-entrypoint.sh"]
CMD ["apache2-foreground"]
