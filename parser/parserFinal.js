// Import required modules
const cheerio = require('cheerio')
const fs = require('fs')

// Function to extract base64 image data from the HTML string
const getImageBase64 = (imgId, html) => {
  try {
    // Split the HTML string around the image ID
    const splitHTMLString = `${html}`
      .replace(/\s/g, '')
      .split(`varii=['${imgId}']`)

    // Extract the relevant part of the string
    let str = splitHTMLString[splitHTMLString.length - 2]

    // Find the start and end indices of the base64 data
    let key = 'vars='
    let index = str.lastIndexOf(key)
    let value
    if (index !== -1) {
      let valueStartIndex = index + key.length
      let valueEndIndex = str.indexOf(' ', valueStartIndex)
      if (valueEndIndex === -1) {
        // If no space found, go till the end of the string
        valueEndIndex = str.length
      }
      value = str.substring(valueStartIndex, valueEndIndex)
    }

    // Remove single quotes and split the base64 data at '\'
    return value.replace("'", '').replace("'", '').split('\\', 1)[0]
  } catch (error) {
    return null
  }
}

// Function to create an artwork object from a HTML element
const createArtwork = (childElement, $, html) => {
  // Load the child element HTML into cheerio
  const child = cheerio.load($(childElement).html())
  let link = child('a').attr('href') || null

  // Get the image ID from the child element
  const imageId = child('img').attr('id') || null
  let image = null
  if (imageId) {
    try {
      // Get the base64 image data
      const imageData = getImageBase64(imageId, html)
      image = imageData
    } catch (error) {
      // console.error(`Failed to get base64 for imageId:${imageId}: ${error}`)
    }
  }

  let name = null
  let extensions = []
  // Get all div children of the anchor tag that don't have images
  let divChildren = child('a').children('div').not(':has(img)')

  // Iterate over the div children
  divChildren.each(function () {
    // Extract text from the first child element
    let firstChildText = $(this)
      .children(':first')
      .text()
      .replace(/\n|\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (firstChildText) {
      name = name || firstChildText
      if (name !== firstChildText) {
        extensions.push(firstChildText)
      }
    }

    // Extract text from the remaining child elements
    let otherChildrenText = $(this)
      .children(':gt(0)')
      .map((_, elem) =>
        $(elem).text().replace(/\n|\t/g, ' ').replace(/\s+/g, ' ').trim()
      )
      .get()

    extensions.push(...otherChildrenText)
  })

  // Prepare the result object
  let result = {
    name,
    extensions,
    link: `https://www.google.com${link}`,
    image,
  }

  // If extensions is empty or contains only empty strings, delete it from the result
  if (extensions.length === 0 || extensions.every((str) => str === '')) {
    delete result.extensions
  }
  // Return the result object
  return result
}

// Function to find the carousel and its items
const findCarouselAndItems = ($) => {
  // Find the first element that contains multiple images
  const firstElement = $(
    //look for elements with images inside them (div or a)
    ':has(> div > a:has(img)), :has(> a:has(img)), g-scrolling-carousel'
  )
    .filter(
      (_, elem) =>
        //look for elements with more than one image
        $(elem).children('div').children('a:has(img)').length > 1 ||
        $(elem).children('a:has(img)').length > 1
    )
    .first()

  // Get the child elements of the first element
  const children = firstElement.children().toArray()
  return children
}

const parseSerp = (htmlFilePath) => {
  // Read the HTML file
  const html = fs.readFileSync(htmlFilePath, 'utf8')
  const $ = cheerio.load(html)

  // Find the carousel and its items
  const carouselItems = findCarouselAndItems($)
  // Iterate over the carousel items and create artwork objects
  const results = carouselItems.map((child) => createArtwork(child, $, html))

  // fs.writeFileSync('results.json', JSON.stringify({ results }, null, 2))
  return results
}

module.exports = {
  parseSerp,
  createArtwork,
  getImageBase64,
  findCarouselAndItems,
}
