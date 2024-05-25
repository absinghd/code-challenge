# SERP Carousel Parser

This project parses HTML files and extracts specific data from them. The parsing logic is contained in `parserFinal.js`, and the main script is `index.js`.

## Getting Started

### Installing

1. Clone the repository to your local machine.
2. Navigate to the `parser` directory.
3. Run `npm install` to install the necessary dependencies.

### Usage

Make sure you're in the `parser` directory.
The `index.js` script is used to parse a specific HTML file. It uses the `parseSerp` function from `parserFinal.js` to do this. The results are then written to a file named `results.json`.

To run the script, use the following command:

```bash
npm run start
```

By default, the script parses the file `../files/van-gogh-paintings.html`. If you want to parse a different file, replace `../files/van-gogh-paintings.html` with the path to your desired HTML file in `index.js` or the html files included within the `parser/htmlFiles` directory.

example 1: `const results = parseSerp('./htmlFiles/index.html')`
example 2: `const results = parseSerp('./htmlFiles/index2.html')`
example 3: `const results = parseSerp('./htmlFiles/index3.html')`

### Testing

The project includes tests that compare the parser's output against expected results. To run the tests, use the following command:

```bash
npm run test
```
