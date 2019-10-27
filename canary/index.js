const core = require('@actions/core');
const wait = require('./wait');
const github = require('@actions/github');
const exec = require('@actions/exec');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const ms = core.getInput('milliseconds');
    console.log(`Waiting ${ms} milliseconds ...`)

    core.debug((new Date()).toTimeString())
    wait(parseInt(ms));
    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());

      // Get client and context
      const client = new github.GitHub(
        core.getInput('bot-token', {required: true})
      );
      const pkgName = core.getInput('package-name', {required: true})
      const context = github.context;
      core.debug(`action: ${context.payload.action}`);
      // core.debug(`payload: ${JSON.stringify(context.payload, null, 2)}`);
      const {owner, repo, number} = context.issue;
      core.debug(`owner: ${owner}`);
      core.debug(`number: ${number}`);
      core.debug(`repo: ${repo}`)
      //  npm --no-git-tag-version version prerelease --preid=12345
      let myOutput = '';

      const options = {};
      options.listeners = {
        stdout: (data) => {
          myOutput += data.toString();
        }
      };
      const shortCommit = context.payload.before.split('', 7).join('');
      await exec.exec(`npm --no-git-tag-version version prerelease --preid=${shortCommit}`, [], options);
      const outputExec = myOutput;
      core.debug(`outputExec: ${outputExec}`);
      // FUTURE: we can render this
      const tessst = await client.markdown.render({
        text: '### test'
      });

      core.debug(`outputExec: ${tessst}`);
      // post comment on pull request
      await client.pulls.createReview({
        owner,
        repo,
        pull_number: number,
        body: "Thanks for your PR, we have promoted your PR and created a canary version of your proposal: \n ``` \n npm install --global "+pkgName+"@"+outputExec+" --registry https://registry.verdaccio.org \n```",
        event: 'COMMENT'
      });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
