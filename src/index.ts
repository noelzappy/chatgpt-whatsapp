const qrcode = require("qrcode-terminal");
import { api } from "./configs/chatAPI.config";
import { wClient as client } from "./configs/wClient.config";
import { handler as handleMessage } from "./controllers/message.controller";
import Logger from "./utils/logger.util";
import startCrons from "./crons";
import { sendMorningGreetings } from "./services/message.service";

// Entrypoint
const start = async () => {
  // Ensure the API is properly authenticated
  try {
    await api.initSession();
  } catch (error: any) {
    Logger.error(
      `Failed to authenticate with the ChatGPT API: ${error.message}`
    );

    api.closeSession();
    process.exit(1);
  }

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
    if (message.body.length == 0) return;
    if (message.from == "status@broadcast") return;
    await handleMessage(message, message.body);
  });

  client.initialize();
};

start();
