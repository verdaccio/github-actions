const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const _ = require('lodash');

const buildBody = (message, pkgName, outputExec, isGlobal, registry = 'https://registry.verdaccio.org') => {
  return `${message}
\
\
\`\`\`
\
npm install${isGlobal == 'true' ? ' --global ' : ' '}${pkgName}@${outputExec} --registry ${registry}
\
\`\`\`
\
`;
}

// most @actions toolkit packages have async methods
async function run() {
  try {
      // Get client and context
      const client = new github.GitHub(
        core.getInput('bot-token', {required: true})
      );
      const pkgName = core.getInput('package-name', {required: true});
      const message = core.getInput('message', {required: true});
      const isGlobal = core.getInput('is-global', {required: true});
      const context = github.context;
      core.debug(`action: ${context.payload.action}`);

      core.debug(`payload: ${JSON.stringify(context.payload, null, 2)}`);

      const {owner, repo, number} = context.issue;
      const pull_number = number;
      // core.debug(`owner: ${owner}`);
      // core.debug(`number: ${number}`);
      // core.debug(`repo: ${repo}`)

      //  npm --no-git-tag-version version prerelease --preid=12345
      let myOutput = '';
      const options = {};
      options.listeners = {
        stdout: (data) => {
          myOutput += data.toString();
        }
      };
      const commit = context.payload.pull_request.head.sha;
      const shortCommit = commit.split('', 7).join('');
      await exec.exec(`npm --no-git-tag-version version prerelease --preid=${shortCommit}-pr${number}`, [], options);
      const npmVersion = myOutput.trim();
      const markdown = await client.markdown.render({
        text: buildBody(message, pkgName, npmVersion, isGlobal)
      });
      const body = markdown.data;

      const listReviews = await client.issues.listComments({
        owner,
        repo,
        issue_number: pull_number
      });

      const listCommmentsBot = _.filter(listReviews.data, function(comment) {
        return comment.user.login === 'verdacciobot'
      });

      // core.debug(`listCommmentsBot: ${JSON.stringify(listCommmentsBot, null, 2)}`);

      for (const comment of listCommmentsBot) {
        const commentId = comment.id;
        core.debug(`comment: removing: ${commentId}`);
        const repsonse = await client.issues.deleteComment({
            owner,
            repo,
            comment_id: commentId
        });

        core.debug(`comment: removed: ${JSON.stringify(repsonse, null, 2)}`);
      }

      await client.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body
      });

      core.debug('comment registry updated');
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
