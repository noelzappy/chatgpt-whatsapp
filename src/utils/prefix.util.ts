import Prefix from "../models/prefix.model";
import { prefixes } from "../configs/constants.config";

export const getPrefix = (message: string): Prefix => {
  const containsPrefix = prefixes.some((prefix) => message.includes(prefix));

  console.log(containsPrefix, message);

  if (!containsPrefix) return { isPrefix: false, message, prefix: "" };

  const prefix = prefixes.find((prefix) => message.startsWith(prefix));

  const messageWithoutPrefix = message.replace(prefix, "").trim();

  return { isPrefix: true, message: messageWithoutPrefix, prefix };
};
