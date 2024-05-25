const fs = require('fs')
const { parseSerp } = require('./parserFinal')

const results = parseSerp('../files/van-gogh-paintings.html') // Replace the file path with the HTML file path of choice
fs.writeFileSync('results.json', JSON.stringify({ results }, null, 2))
