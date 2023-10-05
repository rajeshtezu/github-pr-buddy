import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Octokit } from 'octokit';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: { fetch },
});

export async function getLoggedInUser() {
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  console.log('User: ', login);

  return login;
}

export async function fetchOpenPRs(owner, repo) {
  const result = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
  });

  // console.log(result.data[0]);

  const openPRs = result.data
    // .filter((pr) => pr.state === 'open' || pr.state === 'draft')
    .map((pr) => ({
      title: pr.title,
      url: pr.url,
      locked: pr.locked,
      username: pr.user.login,
      site_admin: pr.user.site_admin,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      state: pr.state,
      draft: pr.draft,
    }));

  // console.log('Total open PRs: ', openPRs.length);

  console.log(openPRs);
}
