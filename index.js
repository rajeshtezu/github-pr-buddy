import dotenv from 'dotenv';
dotenv.config();

import Framework from 'webex-node-bot-framework';
import webhook from 'webex-node-bot-framework/webhook.js';
import express from 'express';
import bodyParser from 'body-parser';

import { COMMANDS } from './src/constant.js';
import { sayHello, echoText, getHelp, getOpenPR } from './src/webex-bot.js';

const app = express();
app.use(bodyParser.json());

// framework options
const config = {
  webhookUrl: process.env.WEBHOOK_URL,
  token: process.env.BOT_TOKEN,
  port: process.env.PORT || 80,
};

// init framework
const framework = new Framework(config);
framework.start();

// An initialized event means your webhooks are all registered and the
// framework has created a bot object for all the spaces your bot is in
framework.on('initialized', () => {
  console.log('Framework initialized successfully! [Press CTRL-C to quit]');
});

// A spawn event is generated when the framework finds a space with your bot in it
// You can use the bot object to send messages to that space
// The id field is the id of the framework
// If addedBy is set, it means that a user has added your bot to a new space
// Otherwise, this bot was in the space before this server instance started
framework.on('spawn', (bot, id, addedBy) => {
  if (!addedBy) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(
      `Framework created an object for an existing bot in a space called: ${bot.room.title}`
    );
  } else {
    // addedBy is the ID of the user who just added our bot to a new space,
    // Say hello, and tell users what you do!
    bot.say(
      "Hi there, you can say hello to me.  Don't forget you need to mention me in a group space!"
    );
  }
});

// CUSTOM COMMANDS FOR THE BOT - START
framework.hears(
  COMMANDS.HELLO,
  sayHello,
  "**hello** - say hello and I'll say hello back"
);

framework.hears(
  COMMANDS.ECHO,
  echoText,
  "**echo** - I'll echo back the rest of your message"
);

framework.hears(
  COMMANDS.HELP,
  getHelp,
  '**help** - get a list of my commands',
  0
); // zero is default priority

framework.hears(COMMANDS.OPEN_PR, getOpenPR);

// CUSTOM COMMANDS FOR THE BOT - END

// Its a good practice to handle unexpected input
// Setting a priority > 0 means this will be called only if nothing else matches
framework.hears(
  /.*/gim,
  (bot, trigger) => {
    bot.say(
      'Sorry, I don\'t know how to respond to "%s"',
      trigger.message.text
    );
    bot.say('markdown', framework.showHelp());
  },
  99999
);

// define express path for incoming webhooks
app.post('/', webhook(framework));

// start express server
var server = app.listen(config.port, () => {
  console.log('Framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', () => {
  console.log('stopping...');
  server.close();
  framework.stop().then(() => {
    process.exit();
  });
});
