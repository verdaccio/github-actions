#!/bin/sh

set -e

# create .npmrc
local_registry="http://0.0.0.0:4873"
NPM_AUTH_TOKEN="fake_token"
VERDACCIO_CONFIG_USERCONFIG="${"$HOME/.npmrc"}"
VERDACCIO_REGISTRY_URL="${0.0.0.0:4873}"
VERDACCIO_REGISTRY_SCHEME="http"
printf "//%s/:_authToken=%s\\nregistry=%s\\nstrict-ssl=%s" "$VERDACCIO_REGISTRY_URL" "$NPM_AUTH_TOKEN" $local_registry > "$VERDACCIO_CONFIG_USERCONFIG"

chmod 0600 "$VERDACCIO_CONFIG_USERCONFIG"

# Start local registry
tmp_registry_log=`mktemp`
sh -c "mkdir -p $HOME/.config/verdaccio"
sh -c "cp --verbose /config.yaml $HOME/.config/verdaccio/config.yaml"
sh -c "nohup verdaccio --config $HOME/.config/verdaccio/config.yaml &>$tmp_registry_log &"
# Wait for `verdaccio` to boot
# grep -q 'http address' <(tail -f $tmp_registry_log)
# Login so we can publish packages
sh -c "npm-auth-to-token@1.0.0 -u test -p test -e test@test.com -r $local_registry"
# Run nmp command
sh -c "npm --registry $local_registry publish $1"
