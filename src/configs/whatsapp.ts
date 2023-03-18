import { Client, LocalAuth } from 'whatsapp-web.js';

// Whatsapp Client
const wClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

export default wClient;
