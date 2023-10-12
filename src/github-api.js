import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Octokit } from 'octokit';

import { authors, dateTimeFormat } from './constant.js';

dotenv.config();

const OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

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

export async function fetchOpenPRs() {
  const result = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner: OWNER,
    repo: REPO_NAME,
  });

  const openPRs = result.data
    .filter((pr) => authors.includes(pr.user.login))
    .map((pr) => ({
      title: pr.title,
      url: pr.html_url,
      number: pr.number,
      author: pr.user.login,
      state: pr.state,
      reviewers: pr.requested_reviewers.map((r) => r.login).join(', '),
      created_at: new Date(pr.created_at).toLocaleString('nu', dateTimeFormat),
      draft: pr.draft,
    }));

  return openPRs;
}
