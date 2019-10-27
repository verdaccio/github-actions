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
        core.getInput('repo-token', {required: true})
      );
      const context = github.context;
      core.debug(`action: ${context.payload.action}`);
      // core.debug(`payload: ${JSON.stringify(context.payload, null, 2)}`);
      const {owner, repo, number} = context.issue;
      const issueNumber = context.payload.pull_request.number;
      core.debug(`owner: ${owner}`);
      core.debug(`number: ${number}`);
      core.debug(`repo: ${repo}`)
      //  npm --no-git-tag-version version prerelease --preid=12345
      let myOutput = '';
      let myError = '';

      const options = {};
      options.listeners = {
        stdout: (data) => {
          myOutput += data.toString();
        },
        stderr: (data) => {
          myError += data.toString();
        }
      };
      await exec.exec(`npm --no-git-tag-version version prerelease --preid=${context.payload.before}`, [], options);
      const outputExec = myOutput;
      core.debug(`outputExec: ${outputExec}`)
      // post comment on pull request
      await client.pulls.createReview({
        owner,
        repo,
        pull_number: number,
        body: `Thanks for your PR, we have promoted your PR and created a canary version of your PR: \`npm install --global verdaccio@${outputExec} --registry https://registry.verdaccio.org\``,
        event: 'COMMENT'
      });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
