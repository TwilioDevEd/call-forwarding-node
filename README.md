<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Advanced Call Forwarding with Node and Express

[![Build status](https://api.travis-ci.org/TwilioDevEd/call-forwarding-node.svg?branch=master)](https://travis-ci.org/TwilioDevEd/call-forwarding-node)

Learn how to use [Twilio](https://www.twilio.com) to forward a series of phone calls to your state senators.

## Local Development
This project is built using the [Express](https://expressjs.com) web framework, and runs on Node

To run the app locally, follow these steps:

1. Clone this repository and `cd` into it.

   ```
   git clone https://github.com/TwilioDevEd/call-forwarding-node.git && \
   cd call-forwarding-node
   ```

1. If you don't have node already installed I recommend you to use
   [`nvm`](https://github.com/creationix/nvm#install-script). Once installed
   you can run the command below to install the node version specified in the
   `.nvmrc` file in this project.

   ```
   nvm use
   ```

1. Install the dependencies with:

   ```
   npm install
   ```

1. Run the migrations:

   ```
   npm run migrate
   ```

1. Seed the database with data:

   ```
   npm run seed
   ```

   This will load senators.json and US zip codes into your SQLite database.
   **Please note:** our senators dataset is likely outdated, and we've mapped senators to placeholder phone numbers that are set up with Twilio to read a message and hang up.

1. Expose your application to the internet using [ngrok](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html). In a separate terminal session, start ngrok with:

   ```
   ngrok http 3000
   ```

   Once you have started ngrok, update your TwiML application's voice URL setting to use your ngrok hostname. It will look something like this in your Twilio [console](https://www.twilio.com/console/phone-numbers/):

   `https://d06f533b.ngrok.io/callcongress/welcome`

1. Start your development server:

   ```
   npm start
   ```

   Once ngrok is running, open up your browser and go to your ngrok URL.

## Run the Tests

```
npm test
```

## Meta
* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](https://opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
