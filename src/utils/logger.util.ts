import { APP_NAME } from '../configs/constant';

class Logger {
  public static log(message: string): void {
    console.log(`[${APP_NAME}] ${message}`);
  }

  public static error(message: string): void {
    console.error(`[${APP_NAME}] ${message}`);
  }

  public static info(message: string): void {
    console.info(`[${APP_NAME}] ${message}`);
  }

  public static warn(message: string): void {
    console.warn(`[${APP_NAME}] ${message}`);
  }
}

export default Logger;
