const stringSimilarity = require("string-similarity");

const wordsDictionary = ["I'm just a computer program", "I am an AI language model", "an artificial intelligence", "I'm just a computer program"]
    

export const validateResponse = (response: String) => {

    const wrongStarting = response.startsWith("I'm sorry,") || response.startsWith("Is there something specific you would")
    
    if (wrongStarting) return false

    // check if the response contains any of the words that are have similarity above 0.7 with the words in the dictionary
    // This is not an efficient way to do it, but as proof of concept it works
    const wordsFound = wordsDictionary.filter(word => stringSimilarity.compareTwoStrings(word, response) > 0.7)


    if (wordsFound.length > 0) return false

    return true
 }