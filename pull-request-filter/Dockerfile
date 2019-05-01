FROM alpine:latest

LABEL "com.github.actions.name"="git checkout fork"
LABEL "com.github.actions.description"="Checks pull request from a fork"
LABEL "com.github.actions.icon"="git-pull-request"
LABEL "com.github.actions.color"="white"
LABEL "repository"="https://github.com/verdaccio/github-actions"
LABEL "maintainer"="Verdaccio"

RUN	apk add --no-cache \
    git \
    jq

COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]