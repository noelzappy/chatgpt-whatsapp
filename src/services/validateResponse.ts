
const wordsDictionary = ["I'm just a computer program", "I am an AI language model", "an artificial intelligence"]
    

export const validateResponse = (response: String) => {

    const wrongStarting = response.startsWith("I'm sorry,") || response.startsWith("Is there something specific you would")
    
    if (wrongStarting) return false

    const words = response.split(" ")
    const wordsFound = words.filter(word => wordsDictionary.includes(word))

    if (wordsFound.length > 0) return false

    return true
 }