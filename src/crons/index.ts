import Logger from "../utils/logger.util";
import {
  afternoonGreetingsCron,
  morningGreetingsCron,
  eveningGreetingsCron,
} from "./greetings.cron";

const startCrons = async () => {
  morningGreetingsCron.start();
  afternoonGreetingsCron.start();
  eveningGreetingsCron.start();

  Logger.info("Crons started");
};

export default startCrons;
