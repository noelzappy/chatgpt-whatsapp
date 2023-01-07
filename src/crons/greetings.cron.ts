import cron from "node-cron";
import cronTime from "cron-time-generator";

import { sendMorningGreetings } from "../services/message.service";

const morningTime = cronTime.everyTuesdayAt(9, 10);

export const morningGreetingsCron = cron.schedule(morningTime, () => {
  sendMorningGreetings();
});
