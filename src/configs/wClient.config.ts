const { Client, LocalAuth } = require("whatsapp-web.js");

// Whatsapp Client
export const wClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});
