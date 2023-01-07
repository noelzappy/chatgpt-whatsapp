import Logger from "../utils/logger.util";
import { morningGreetingsCron } from "./greetings.cron";

const startCrons = async () => {
  morningGreetingsCron.start();

  Logger.info("All Crons started");
};

export default startCrons;
