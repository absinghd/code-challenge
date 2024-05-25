const fs = require('fs')
const cheerio = require('cheerio')
//import the parseSerp function from parserFinal.js
const {
  parseSerp,
  getImageBase64,
  createArtwork,
  findCarouselAndItems,
} = require('./parserFinal')
// Import the test data of expected results for index.html
const expectedResults = require('./test.indexResults.json')

// set results to the parsed index.html file
const results = parseSerp('./htmlFiles/index.html')

//test the parseSerp function
describe('parseSerp', () => {
  //test to check if the objects from parserFinal and expected results are equal
  test('differenceInObjects returns empty object', () => {
    expect(JSON.stringify({ results }, null, 2)).toEqual(
      JSON.stringify(expectedResults, null, 2)
    )
  })
})

describe('getImageBase64', () => {
  //test to check if the function extracts the base64 image data from the HTML string
  test('should extract base64 image data from HTML string', () => {
    const imgId = 'kximg1'
    const html = `<html><body>var s='data:image/png;base64,iVBORw0KGgo='var ii=['${imgId}']</body></html>`
    const expectedBase64 = 'data:image/png;base64,iVBORw0KGgo='

    const base64 = getImageBase64(imgId, html)

    expect(base64).toBe(expectedBase64)
  })

  //test to check if the function returns null if no image is found
  test('should return null if no image is found', () => {
    const imgId = 'someImageId'
    const html = `<html><body>varii=['${imgId}'] vars=''</body></html>`

    const base64 = getImageBase64(imgId, html)

    expect(base64).toBeNull()
  })
})

//test findCarousel function
describe('findCarousel', () => {
  const html = fs.readFileSync('./htmlFiles/index.html', 'utf8')

  const $ = cheerio.load(html)
  const carouselItems = findCarouselAndItems($)

  test('should find 51 carosel items', () => {
    expect(carouselItems.length).toBe(51)
  })

  //test createArtwork function
  describe('createArtwork', () => {
    test('should create an artwork object from HTML element', () => {
      const childElement = carouselItems[0]
      const artwork = createArtwork(childElement, $, html)

      expect(artwork).toEqual(expectedResults.results[0])
    })
  })
})
