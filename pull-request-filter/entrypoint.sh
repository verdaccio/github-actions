#!/bin/sh -l

set -e
set -o pipefail

# Get github event data
FORK=`jq .pull_request.head.repo.fork "$GITHUB_EVENT_PATH"`

if [[ "$FORK" == "false" ]]; then
  echo "Pull request is not from a fork."
  exit 78
fi

exit 0