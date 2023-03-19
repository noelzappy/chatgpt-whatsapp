import qrcode from 'qrcode-terminal';
import { Message } from 'whatsapp-web.js';
import client from './configs/whatsapp';
import handleMessage from './handlers/message';
import Logger from './utils/logger.util';

const start = async (): Promise<void> => {
  try {
    // Whatsapp auth
    client.on('qr', (qr: string) => {
      Logger.log('Scan this QR code in whatsapp to log in:');
      qrcode.generate(qr, { small: true });
    });

    // Whatsapp ready
    client.on('ready', () => {
      Logger.log('Client is ready!');
    });

    // Whatsapp message
    client.on('message', async (message: Message) => {
      try {
        if (message.body.length == 0 || message.from == 'status@broadcast') {
          return;
        }
        
        await handleMessage(message);
      } catch (error) {
        Logger.error(error);
      }
    });

    client.initialize();
  } catch (error: unknown) {
    Logger.error(`Failed to initialize the client: ${JSON.stringify(error)}`);
    start();
  }
};

start();
