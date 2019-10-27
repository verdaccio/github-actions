# Publish a NPM package in a local registry with Verdaccio

Test the integrity of a package publishing in [Verdaccio](https://verdaccio.org/).

```
    - uses: verdaccio/github-actions/publish@master
      with:
        cli: publish
```

See in action in a full example:

```
name: CI

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: actions/setup-node@v1
      with:
        node-version: '12.x'
    - run: npm install
    - run: npm test
    - uses: verdaccio/github-actions/publish@master
      with:
        cli: publish

```