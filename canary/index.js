const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const _ = require('lodash');

const buildBody = (message, pkgName, outputExec, isGlobal = 'false', registry = 'https://registry.verdaccio.org') => {
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

async function run() {
  try {
      // Get client and context
      const client = new github.GitHub(
        core.getInput('bot-token', {required: true})
      );
      const pkgName = core.getInput('package-name', {required: true});
      const message = core.getInput('message', {required: true});
      const isGlobal = core.getInput('is-global', {required: false});
      const registry = core.getInput('registry', {required: false});
      const context = github.context;
      const {owner, repo, number} = context.issue;
      const pull_number = number;
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
        text: buildBody(message, pkgName, npmVersion, isGlobal, registry)
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

      for (const comment of listCommmentsBot) {
        const commentId = comment.id;
        await client.issues.deleteComment({
            owner,
            repo,
            comment_id: commentId
        });
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
