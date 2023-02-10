export const countWords = (sentence: string) => {
  const arr = sentence.split(" ");

  return arr.filter((word) => word !== "").length;
};
