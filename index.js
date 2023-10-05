import { getLoggedInUser, fetchOpenPRs } from './github-api.js';

async function main() {
  try {
    await getLoggedInUser();

    await fetchOpenPRs('webex', 'webex-js-sdk');
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await main();
})();
