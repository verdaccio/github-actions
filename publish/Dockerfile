FROM verdaccio/verdaccio:4.x-next

LABEL "com.github.actions.name"="verdaccio publish"
LABEL "com.github.actions.description"="Publish on Verdaccio"
LABEL "com.github.actions.icon"="play-circle"
LABEL "com.github.actions.color"="green"

LABEL "repository"="https://github.com/verdaccio/github-actions"
LABEL "homepage"="https://github.com/verdaccio/github-actions"
LABEL "maintainer"="Juan Picado <juanpicado19@gmail.com>"

RUN sudo npm install -g verdaccio-auth-memory

COPY config.yaml /verdaccio/conf/config.yaml

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]