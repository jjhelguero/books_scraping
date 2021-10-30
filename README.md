## Using Cypress to scrape web pages

This is a basic example of how to utilize cypress to scrape web pages and write the date into files in the same directory.  [Books To Scrape](https://books.toscrape.com/) is a website designed to practice web scraping.
This repo holds two examples: 

1.) Scraping book basic details on the landing page
```
title
price
availability
starRating
```
2.) Scraping all books in "Sequential Art" category for their
```
title
price excluding tax
price including tax
tax
availability
number of reviews
```

## Installation

Install npm package:

```
npm install
```


## Cypress

Open Cypress [headed mode]:

```
npm run cy:open
```

Run Cypress [headless mode]:

```
npm run cy:run
```