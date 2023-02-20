const qrcode = require("qrcode-terminal");
import { wClient as client } from "./configs/wClient.config";
import { handler as handleMessage } from "./controllers/message.controller";
import Logger from "./utils/logger.util";
import startCrons from "./crons";

// Entrypoint
const start = async () => {
  try {
    // Whatsapp auth
    client.on("qr", (qr: string) => {
      Logger.log("Scan this QR code in whatsapp to log in:");
      qrcode.generate(qr, { small: true });
    });

    // Whatsapp ready
    client.on("ready", () => {
      Logger.log("Client is ready!");
      startCrons();
    });

    // Whatsapp message
    client.on("message", async (message: any) => {
      try {
        if (message.body.length == 0) return;
        if (message.from == "status@broadcast") return;
        await handleMessage(message, message.body);
      } catch (error) {
        Logger.error(error);
      }
    });

    client.initialize();
  } catch (error: any) {
    Logger.error(`Failed to initialize the client: ${error.message}`);
    start();
  }
};

start();
