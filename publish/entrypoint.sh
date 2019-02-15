#!/bin/sh

set -e

local_registry="http://0.0.0.0:4873"

# Start local registry
tmp_registry_log=`mktemp`
sh -c "mkdir -p $HOME/.config/verdaccio"
sh -c "cp --verbose /config.yaml $HOME/.config/verdaccio/config.yaml"
sh -c "nohup verdaccio --config $HOME/.config/verdaccio/config.yaml &>$tmp_registry_log &"
# Wait for `verdaccio` to boot
# FIXME: this throws a syntax error, but would be great to make it run
# grep -q 'http address' <(tail -f $tmp_registry_log)
# Login so we can publish packages
sh -c "npm-auth-to-token -u test -p test -e test@test.com -r $local_registry"
# Run nmp command
sh -c "npm --registry $local_registry publish $1"
