## Usage

An example workflow to build, test, and publish an npm package to the default public registry follows:

```hcl
workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Build" {
  uses = "verdaccio/github-actions/yarn@master"
  args = "install"
}

action "Test" {
  needs = "Build"
  uses = "verdaccio/github-actions/yarn@master"
  args = "test"
}

action "Publish" {
  needs = "Test"
  uses = "verdaccio/github-actions/yarn@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
```