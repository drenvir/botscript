import { assert } from 'chai';
import { BotScript, Request } from '../../src/engine';

describe('BotScript', () => {

  const bot = new BotScript();
  const flowsRequest = new Request();

  bot.parse(`
  ! name BotScript

  + hello bot
  - Hello human!

  + what is your name
  - My name is [name]

  ~ age
  - How old are you?
  + I am #{age}
  + #{age}

  ~ email
  - What is your email
  + My email is *{email}

  + my name is *{name}
  + *{name} is my name
  ~ age
  ~ email
  - Hello $name, you are $age and email $email!

  `);

  describe('basic reply', () => {
    it('respond a message to human', async () => {
      const req = new Request('hello bot');
      await bot.handleAsync(req);
      assert.match(req.speechResponse, /hello human/i, 'bot reply human');
    });

    it('should reply with definition', async () => {
      const req = new Request('what is your name');
      await bot.handleAsync(req);
      assert.match(req.speechResponse, /my name is botscript/i, 'bot shows his name');
    });
  });

  describe('basic dialogue flows', () => {
    it('bot should ask human age', async () => {
      const req = flowsRequest.enter('My name is Vu');
      await bot.handleAsync(req);
      assert.isTrue(req.isFlowing, 'enter dialogue flows!');
      assert.match(req.speechResponse, /how old are you/i, 'bot ask human\'s age');
    });

    it('bot should prompt again', async () => {
      const req = flowsRequest.enter('something');
      await bot.handleAsync(req);
      assert.isTrue(req.isFlowing, 'still in dialogue flows!');
      assert.match(req.speechResponse, /how old are you/i, 'prompt one again');
    });

    it('bot should ask human email', async () => {
      const req = flowsRequest.enter('20');
      await bot.handleAsync(req);
      assert.isTrue(req.isFlowing, 'still in dialogue flows!');
      assert.equal(req.variables.name, 'Vu', 'human name');
      assert.equal(req.variables.age, '20', 'human age');
      assert.match(req.speechResponse, /What is your email/i, 'bot send a next question');
    });

    it('bot should respond a greet with human name, age and email', async () => {
      const req = flowsRequest.enter('my email is vunb@example.com');
      await bot.handleAsync(req);
      assert.isFalse(req.isFlowing, 'exit dialogue flows!');
      assert.equal(req.variables.name, 'Vu', 'human name');
      assert.equal(req.variables.age, '20', 'human age');
      assert.equal(req.variables.email, 'vunb@example.com', 'human email');
      assert.match(req.speechResponse, /hello/i, 'bot send a greeting');
    });
  });

  describe('no reply', () => {
    it('should respond no reply!', async () => {
      const req = new Request('sfdsfi!');
      await bot.handleAsync(req);
      assert.match(req.speechResponse, /no reply/i, 'bot no reply');
    });
  });

  describe('add custom pattern', () => {
    // tslint:disable-next-line: no-shadowed-variable
    const bot = new BotScript();
    bot.plugin('nlp', (req) => {
      if (req.message === 'tôi là ai') {
        req.intent = 'whoami';
        req.entities = [{
          name: 'PER',
          value: 'Genius',
        }];
      }
    });
    bot.parse(`
    + ([{ tag:VB }]) [{ word:you }]
    - So you want to $1 me, huh?

    + intent: whoami
    - You are genius!

    > nlp
    `);
    bot
      .addPatternCapability({
        name: 'TokensRegex',
        match: /\[\s*\{\s*(?:word|tag|lemma|ner|normalized):/i,
        func: (pattern) => ({
          source: pattern,
          test: (input) => /love/.test(input),
          exec: (input) => [input, 'love'],
          toString: () => pattern,
        }),
      })
      .addPatternCapability({
        name: 'Intent detection',
        match: /^intent:/i,
        func: (pattern, req) => ({
          source: pattern,
          test: (input) => {
            const vIntentName = pattern.replace(/^intent:/i, '').trim();
            return req.intent === vIntentName;
          },
          exec: (input) => {
            // entities list
            return req.entities.map((x: any) => x.value);
          },
          toString: () => pattern,
        }),
      });

    it('should support TokensRegex', async () => {
      const req = await bot.handleAsync(new Request('love you'));
      assert.match(req.speechResponse, /you want to love/i, 'bot reply');
    });

    it('should detect intent', async () => {
      const req = await bot.handleAsync(new Request('tôi là ai'));
      assert.match(req.intent, /whoami/i, 'intent');
      assert.match(req.speechResponse, /you are genius/i, 'bot reply');
    });
  });

});
