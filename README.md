# BotScript

A text-based scripting language, dialog system and bot engine for Conversational User Interfaces (CUI)

[![Join the chat at https://gitter.im/yeuai/rivebot-ce](https://badges.gitter.im/yeuai/rivebot-ce.svg)](https://gitter.im/yeuai/rivebot-ce)
[![Git tag](https://img.shields.io/github/tag/yeuai/botscript.svg)](https://github.com/yeuai/botscript)
[![Travis](https://travis-ci.org/yeuai/botscript.svg)](https://travis-ci.org/yeuai/botscript)

> This is a part of project [yeu.ai](https://github.com/yeuai). An open platform for experiment and training Vietnamese chatbot!

# Specification

To get started playing with BotScript, you must follows the following rules:

## definition

A `definition` is an identifier of an entity or a variable.

The syntax start with symbol `!`:

```bash
! name Rivebot
```

The `Rivebot` is value of the variable `name`.

To define a list of items, just enter item in a new line which started with symbol `-`:

```bash
! colors
- red
- green
- blue
```

## comment

Comments make your code or your script clearer, you can add a comment in BotScript document by add symbol `#` at the begining of a line:

```bash
# here is a comment
# here is an other
```

## dialogue

A dialogue is a piece of conversation that human and bot interact with each other. 

A dialogue must contains a `+` line, that defines a pattern can activate the bot to respond. This line also called with other name **trigger**.

A dialogue also must contains a `-` line, that defines a pattern response which is output to reply to human.

A dialogue must have at least one reply and one trigger.

```bash
+ message pattern
- message reply
```

Example:

```bash
+ hello bot
- Hello, human!
```

A dialogue may contains:

* flows
* conditions
* variables
* commands
* patterns

## triggers

A trigger is a pattern help bot knows what human is saying.

A trigger may contains **wildcards**. With wildcards, you can set a placeholder within trigger that the bot can capture.

```bash
+ My name is *{name}
- Nice to meet you $name!
```

A dialogue may contains more than one trigger. Which helps bot to detect exactly in more case.

```bash
+ My name is *{name}
+ *{name} is my name
- Nice to meet you $name!
```

A trigger may contains:

* definition optionals
* ~~command evaluation~~
* patterns
* variable

## replies

A reply begin with `-` symbol in the dialogue and goes with the trigger. If the dialogue has multiple replies then a random reply is selected.

```bash
+ hello
- Hello. What is your name?
- Hi. Could you tell me your name?
- [yes]. What's your name?
```

A reply may contains:

* replies definition reference
* variables

## flows

Flows are tasks which need to be resolved. A flow can used to determine a precise flow of conversation 

A flow must start with a `~` line, that defines the the task name.

A flow contains lines started with symbol `-` to guide human answers the quiz and may contains lines `+` help the bot captures the information. If the flow does not contains `+`, after responded the flow will ends.

A flow can referenced by an other.

Flows are activated within a dialogue. The bot will respond if all tasks are resolved!

```bash
~ maker
- What cell phone vendor?
- Which brand of smartphone do you want to buy?
+ I want to buy *{maker}
+ *{maker}
```

The dialogue jumps to the splash flow then back to continue.

```bash
~ random
- I am happy to hear you!
- It's fine today.

+ hello *
~ random
- Great!
```

A flow may contains:

* flows
* prompt
* replies

## prompt

## conditions

A condition begin with `*` symbol. Before bot replies to human, the conditions will be checked and do some logics.

There are three types of condition in botscript dialogues:

* Conditional reply
* Conditional flow
* Conditional redirect
* Conditional command
* Conditional prompt

A conditional reply let bot replies smarter base on the condition or pick random replies from a list definition. That means before reply bot will check its memory and create reponse if the bot knows.

```bash
* $name == undefined -> You never told me your name
```

A conditional flow let bot resolves an additional task if the condition is match.

```bash
* $topic == buy phone ~> ask phone
```

A conditional redirect let bot breaks current dialogue and flows to turn to other dialogue. This helps bot cancel current task and do a new one if the condition is met.

```bash
* $action == cancel >> task cancel
```

A conditional command let bot execute an http POST request to api endpoint with `req` data context.

```bash
* $input == play music @> play favorite music
```

A conditional prompt allows bot sending to human additional prompt list. This helps human knows how to reply to the bot after that.

```bash
* $input == i dont know ?> [show the list]
```

Example:

```bash

# conditional reply
+ what is my name
* $name == undefined -> You never told me your name.
- Your name is $name!
- Aren\'t you $name?

# conditional flow
+ *advise me
* $topic == buy phone ~> ask phone
* $topic == ask warranty ~> warranty guide
~ ask something
- You are done! Do you want ask more?

# conditional redirect
+ i want to say *{action}
* $action == cancel >> task cancel
* $action == something -> [bot say something]
- You said $action
```

## commands

## variables

What good is a chatbot if it can't even remember your name? BotScript has the capability to captures the information given by human and automatically store its into the request context.

A variable appears in a dialogue in both triggers and replies.

A variable is declared within parentheses: `*{var1}` to capture a string and `#{var2}` to captures a number.

A variable is populated in replies by defining after `$var1` sign or within form `${var2}`. 

Example:

```bash
+ My name is *{name}
- Nice to meet you $name!

+ I am #{age} years old
- You are $age
```

## patterns

# Examples

See the [`examples/`](./examples) directory.


Contributing
============

Pull requests and stars are highly welcome.

For bugs and feature requests, please [create an issue](https://github.com/yeuai/botscript/issues/new).

License
=======

BotScript is MIT licensed.
