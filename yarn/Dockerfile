FROM node:24-alpine

LABEL version="1.0.0"
LABEL repository="https://github.com/verdaccio/github-actions/yarn"
LABEL homepage="https://github.com/verdaccio/github-actions/yarn"
LABEL "maintainer"="Juan Picado <juanpicado19@gmail.com>"

LABEL com.github.actions.name="GitHub Action for Yarn"
LABEL com.github.actions.description="Wraps the yarn CLI to enable common yarn commands."
LABEL com.github.actions.icon="package"
LABEL "com.github.actions.color"="#4b5e40"
# COPY LICENSE README.md THIRD_PARTY_NOTICE.md /

COPY "entrypoint.sh" "/entrypoint.sh"
ENTRYPOINT ["/entrypoint.sh"]
CMD ["help"]