import { fetchOpenPRs } from './github-api.js';

export const sayHello = (bot, trigger) => {
  console.log('said hello');
  bot.say('Hello %s!', trigger.person.displayName);
};

export const echoText = (bot, trigger) => {
  bot.say('markdown', `You said: ${trigger.prompt}`);
};

export const getHelp = (bot, trigger) => {
  bot.say('markdown', framework.showHelp());
};

export const getOpenPR = async (bot, trigger) => {
  try {
    await bot.say('** Fetching open PRs for you. Please wait...');
    const openPRs = await fetchOpenPRs();

    let prText = openPRs.reduce((acc, pr) => {
      acc += `**PR** - [${pr.number}](${pr.url}) \n **Title** - ${
        pr.title
      } \n **Author** - ${pr.author} \n **State** - ${
        pr.state
      } \n **Reviewers** - ${pr.reviewers || 'NA'} \n **Created at** - ${
        pr.created_at
      } \n **Draft PR** - ${pr.draft} \n\n --- \n\n`;

      return acc;
    }, '');

    prText += `Total open PRs - ${openPRs.length}`;

    bot.say('markdown', prText);
  } catch (error) {
    console.log('Error: ', error);
    bot.say('Unable to fetch open PRs.');
  }
};
