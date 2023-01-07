import cron from "node-cron";
import { sendMorningGreetings } from "../services/message.service";

// schedule a cron to run every day at 8:00  0 8 * * *
export const morningGreetingsCron = cron.schedule("* * * * *", () => {
  sendMorningGreetings();
});

// schedule a cron to run every day at 12:00 PM
export const afternoonGreetingsCron = cron.schedule("0 12 * * *", () => {
  console.log("Afternoon greetings cron is running");
});

// schedule a cron to run every day at 6:00 PM
export const eveningGreetingsCron = cron.schedule("0 18 * * *", () => {
  console.log("Evening greetings cron is running");
});
