import * as core from '@actions/core'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url');
    core.info('Parsing POST request...');
    const parsedData = core.getInput('data');
    core.info(`Parsing data request... ${parsedData}`);
    const data = JSON.parse(parsedData);
    core.info('Sending POST request...');
    await axios.post(url, data);
  } catch (error) {
    core.setFailed(error);
  }
}

run();
