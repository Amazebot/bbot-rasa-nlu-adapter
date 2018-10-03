[quickstart]:  https://rasa.com/docs/core/quickstart/

# bBot Rasa.ai NLU adapter

[![npm version](https://img.shields.io/npm/v/bbot-watson-tone-nlu.svg?style=flat)](https://www.npmjs.com/package/bbot-rasa-nlu)

NLU adapter for analysing bBot messages with Rasa.ai.

## `~(O_O)~`

Visit [bBot.chat](http://bbot.chat/) for info on the conversation engine.

## Connecting to Rasa

### Local NLU Starter

If you don't already have a Rasa instance, you can use the Rasa starter pack,
which runs a very basic pre-trained NLU API locally, for testing interactions.

Alternatively, within `./sample` is the Rasa [quickstart][quickstart] content,
if you would rather build your own from scratch.

Use the package script to clone the Rasa NLU starter pack:

```
yarn rasa:starter
```

If you haven't installed Rasa NLU yet, run:

```
yarn rasa:install
```

Train the NLU instance with the starter data:

```
yarn rasa:train
```

Run the NLU server:

```
yarn rasa:nlu
```

You can now make HTTP requests to your local server:

```
curl XPOST localhost:5000/parse -d '{"query":"Hello", "project": "current"}'
```

### High Level Architecture

When incoming messages are processed, if it isn't handled by basic text pattern
matching, it will be passed to the Rasa NLU server via HTTP request.

The user data is also added to the request as a slot,  and custom middleware can collect
other details 

This is the process 

[![architecture](https://rasa.com/docs/core/_images/rasa_arch_colour.png)]

### Configuring the bot

The default configs (as per below) can be modified for your custom Rasa hosts.

Add these lines to the bot environment or `.env` file in local path for testing.

```
BOT_RASA_URL=localhost:5000
BOT_RASA_PROJECT=current
```

> Also set `BOT_NLU_MIN_LENGTH=2` if you want NLU to process like 'hi' and 'bye'

These options can also be given as CLI args like `--rasa-url localhost:5000` or
as attributes in `package.json` under `"bot"` like `"rasa-project": "current"`.

## Contributing

This adapter is functional but only provides MVP utility and needs to be matured
with more "real world" experience. If you're using Rasa in production with more
advanced requirements, like custom extractors and actions, please report an
issue to describe your usage and requirements, so we might improve it together.
