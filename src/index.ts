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
      if (message.body.length == 0) return;
      if (message.from == "status@broadcast") return;
      await handleMessage(message, message.body);
    });

    client.on('change_state', (newState) => {
      console.log(newState)
      if(newState === 'CONFLICT') {
        console.log("CONFLICT detected")
        // do something here
      }
      if(newState === 'DEPRECATED_VERSION') {
        console.log("DEPRECATED_VERSION detected")
        // do something here
      }
      if(newState === 'OPENING') {
        console.log("OPENING detected")
        // do something here
      }
      if(newState === 'PAIRING') {
        console.log("PAIRING detected")
        // do something here
      }
      if(newState === 'PROXYBLOCK') {
        console.log("PROXYBLOCK detected")
        // do something here
      }
      if(newState === 'SMB_TOS_BLOCK') {
        console.log("SMB_TOS_BLOCK detected")
        // do something here
      }
      if(newState === 'TIMEOUT') {
        console.log("TIMEOUT detected")
        // do something here
      }
      if(newState === 'TOS_BLOCK') {
        console.log("TOS_BLOCK detected")
        // do something here
      }
      if(newState === 'UNLAUNCHED') {
        console.log("UNLAUNCHED detected")
        // do something here
      }
      if(newState === 'UNPAIRED') {
        console.log("UNPAIRED detected")
        // do something here
      }
      if(newState === 'UNPAIRED_IDLE') {
        console.log("UNPAIRED_IDLE detected")
        // do something here
      }
    });


    client.initialize();
  } catch (error: any) {
    Logger.error(`Failed to initialize the client: ${error.message}`);
    start();
  }
};

start();
