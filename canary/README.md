## Publish a Canary version of your package

This action will modify your package version and create a canary version based in the combination
of your pull request and will publish it to a registry.


### Usage

```
name: Publish Canary Package
on: [pull_request]
jobs:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: verdaccio/github-actions/canary@master
      with:
        message: 'Thanks for your PR, we have promoted your PR and created a canary version of your proposal:'
        is-global: true
        package-name: '@verdaccio/ui-theme'
        registry: 'https://registry.verdaccio.org'
        bot-token: ${{ secrets.VERDACCIO_BOT_TOKEN }}
        bot-name: verdacciobot
    - uses: actions/setup-node@v1
      with:
        node-version: '12.x'
        registry-url: 'https://registry.verdaccio.org'
    - run: npm publish
      env:
        NODE_AUTH_TOKEN: ${{ secrets.VERDACCIO_TOKEN }}
```

> Note that the action do not create Git tags on create a version and it only works with **Pull Request**, eg: `on: [pull_request]`.

The version created would be the combination of the current version, commit sha header and the Pull request number.

Output example:

<p>Thanks for your PR, the @verdaccio/ui package will be accessible from here for testing purposes:</p>
<pre><code>npm install @verdaccio/ui-theme@v0.3.5-35c46c0-pr228.0 --registry https://registry.verdaccio.org
</code></pre>


##### Properties

* `message`: The title of the message (`required`)
* `bot-token`: The registry token. (`required`)
* `package-name`: Add a custom package name (`required`)
* `is-global`: Append `--global` in the install package command (default: `false`)
* `registry`: The registry used with `--registry` (default: `https://registry.verdaccio.org`)
* `bot-name`: The name of the bot (this might be improved in the future, default value `verdacciobot`)


##### Contribute

Run `npm run package` before commit, the `dist` fille should be included in your commit.


Author: Juan Picado <juanpicado19@gmail.com>