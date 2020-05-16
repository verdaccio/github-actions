import * as core from '@actions/core'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url', {required: true});
    core.info('Parsing POST request...');
    const release = core.getInput('release', {required: true});
    core.info(`Parsing data request... ${release}`);
    const data = {
      version: release
    };
    core.info('Sending POST request...');
    await axios.post(url, data);
  } catch (error) {
    core.setFailed(error);
  }
}

run();
