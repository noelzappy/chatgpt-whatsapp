# ChatGPT Whatsapp Chat Bot

This project is a whatsapp bot that uses OpenAI's ChatGPT to respond to user inputs.

## Requirements

- Node.js
- A recent version of npm
- An OpenAI Account
- A Whatsapp Account

## Installation

1. Clone this repository
2. Install the required packages by running `yarn`
3. Put your Email and Password into the .env File (`OPENAI_EMAIL`, `OPENAI_PASSWORD`)
4. Run the bot using `yarn start`
5. A browser opens, complete the captcha and click login
6. Scan the QR Code with Whatsapp (Link a device)
7. Now you're ready to go :)

## Usage

To use the bot, simply send a message with `zappy` command followed by your prompt. For example:

`zappy What is the meaning of life?`

The bot only responds to messages that are received by you, not sent.

## Used libraries

- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
