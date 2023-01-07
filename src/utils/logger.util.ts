import { APP_NAME } from "../configs/constants.config";

class Logger {
  public static log(message: string) {
    console.log(`[${APP_NAME}] ${message}`);
  }

  public static error(message: string) {
    console.error(`[${APP_NAME}] ${message}`);
  }

  public static info(message: string) {
    console.info(`[${APP_NAME}] ${message}`);
  }

  public static warn(message: string) {
    console.warn(`[${APP_NAME}] ${message}`);
  }
}

export default Logger;
