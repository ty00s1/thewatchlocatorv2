#!/bin/bash
set -e

# Run WP's official entrypoint in the background so it copies core files into /var/www/html,
# then we run our init once core is in place.
(
  # wait for core files to land
  for i in $(seq 1 60); do
    if [ -f /var/www/html/wp-load.php ]; then
      break
    fi
    sleep 1
  done

  if [ ! -f /var/www/html/.twl-initialized ]; then
    echo "[twl] running first-time init..."

    cd /var/www/html

    # Copy uploads from the seed directory if WP's uploads dir is empty
    if [ -d /seed/uploads ] && [ -z "$(ls -A /var/www/html/wp-content/uploads 2>/dev/null || true)" ]; then
      echo "[twl] seeding uploads..."
      mkdir -p /var/www/html/wp-content/uploads
      cp -R /seed/uploads/. /var/www/html/wp-content/uploads/
      chown -R www-data:www-data /var/www/html/wp-content/uploads
    fi

    # Wait for the DB seed to land + WP to be addressable
    for i in $(seq 1 30); do
      if wp --allow-root core is-installed 2>/dev/null; then
        break
      fi
      sleep 2
    done

    # Rewrite siteurl/home to v2's port (dump.sql came from the :8080 install)
    wp --allow-root option update siteurl "${WP_PUBLIC_URL:-http://localhost:8081}" || true
    wp --allow-root option update home    "${WP_PUBLIC_URL:-http://localhost:8081}" || true
    wp --allow-root search-replace 'http://localhost:8080' "${WP_PUBLIC_URL:-http://localhost:8081}" \
        --skip-columns=guid --all-tables-with-prefix || true

    # Install + activate WooCommerce (not bundled in dump.sql plugin code)
    wp --allow-root plugin is-installed woocommerce || wp --allow-root plugin install woocommerce
    wp --allow-root plugin is-active woocommerce    || wp --allow-root plugin activate woocommerce

    # Drop the bundled fluff
    wp --allow-root plugin is-installed hello       && wp --allow-root plugin delete hello       || true

    # Activate the headless theme + flush rewrites so /wp-json paths resolve
    wp --allow-root theme activate headless-shim
    wp --allow-root rewrite structure '/%postname%/' --hard
    wp --allow-root rewrite flush --hard

    touch /var/www/html/.twl-initialized
    echo "[twl] init complete."
  fi
) &

# Hand off to the official WP entrypoint (apache foreground)
exec docker-entrypoint.sh "$@"
