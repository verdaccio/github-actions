#!/bin/sh

set -e

if [ -n "$NPM_AUTH_TOKEN" ]; then
  # Respect VERDACCIO_CONFIG_USERCONFIG if it is provided, default to $HOME/.npmrc
  VERDACCIO_CONFIG_USERCONFIG="${VERDACCIO_CONFIG_USERCONFIG-"$HOME/.npmrc"}"
  VERDACCIO_REGISTRY_URL="${VERDACCIO_REGISTRY_URL-localhost:4873}"
  VERDACCIO_STRICT_SSL="${VERDACCIO_STRICT_SSL-true}"
  VERDACCIO_REGISTRY_SCHEME="https"
  if ! $VERDACCIO_STRICT_SSL
  then
    VERDACCIO_REGISTRY_SCHEME="http"
  fi

  printf "//%s/:_authToken=%s\\nregistry=%s\\nstrict-ssl=%s" "$VERDACCIO_REGISTRY_URL" "$NPM_AUTH_TOKEN" "${VERDACCIO_REGISTRY_SCHEME}://$VERDACCIO_REGISTRY_URL" "${VERDACCIO_STRICT_SSL}" > "$VERDACCIO_CONFIG_USERCONFIG"

  chmod 0600 "$VERDACCIO_CONFIG_USERCONFIG"
fi

sh -c "verdaccio & --config /verdaccio/config.yaml"

sh -c "npm --registry http://localhost:4873 $1"