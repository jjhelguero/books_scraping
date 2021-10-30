const hrefTitleSelector = 'h3 a'
const productInformationTableSelector = '[class="table table-striped"]'

//TODO: figure out cy-recurse implementation to refactor function
const getPaginatedSearchResults = () => {
    //get random element on page to begin logic
    cy.get('h1')
            .then( () => {
                //iterate through each href selector to scrape book details and store them in json file, then navigate back one page
                cy.get(hrefTitleSelector)
                    .each(el => {

                        cy.wrap(el)
                            .visit(el[0].href)
                            .then( () => {
                            
                                cy.get('.default')
                                .map((components, index) => {
                                    let book = {
                                        title: Cypress.$('h1')[index].innerText.trim(),
                                        productType: Cypress.$(`${productInformationTableSelector} tbody>tr:nth-child(2)>td`)[index].innerText.trim(),
                                        priceExclTax: Cypress.$(`${productInformationTableSelector} tbody>tr:nth-child(3)>td`)[index].innerText.trim(),
                                        priceInclTax: Cypress.$(`${productInformationTableSelector} tbody>tr:nth-child(4)>td`)[index].innerText.trim(),
                                        tax: Cypress.$(`${productInformationTableSelector} tbody>tr:nth-child(5)>td`)[index].innerText.trim(),
                                        availability: Cypress.$(`${productInformationTableSelector} tbody>tr:nth-child(6)>td`)[index].innerText.trim(),
                                        numberOfReviews: Cypress.$(`${productInformationTableSelector} tbody>tr:nth-child(7)>td`)[index].innerText.trim()
                                    }
                                    cy.writeFile('booksSequentialArtAllDetails',book,{flag: 'a+'})
                                    return book
                                })
                            })
                            .go('back')

                        })
                //Check if current page is last
                cy.get('.current')
                        .then(el => {
                            const parts = el[0].innerText.split(' ')
                            const currentPage = parts[parts.length - 3]
                            const totalPages = parts[parts.length - 1]

                            if(parseInt(totalPages) > parseInt(currentPage)) {
                                cy.get( 'a:contains("next")')
                                .then(el => {
                                    //if so then click on button and rerun book detail scraping
                                    cy.log('Clicking next page results')
                                    cy.wrap(el)
                                        .click()
                                    getPaginatedSearchResults()
                                })
                            }//if not then exit scraping logic
                            else {
                                cy.log('There are no more pages to scrape')
        
                                return
                            }
                        })
               

            })
}

   
it('It scrapes basic book data on landing page', () => {
    cy.visit('/')

    cy.get('article')
    .map((components, index) => {
        //extracts all book details and writes to file in json format
        let book = {
            title: Cypress.$(hrefTitleSelector)[index].title.trim(),
            price: Cypress.$('.price_color')[index].innerText.trim(),
            availability: Cypress.$('.instock.availability')[index].innerText.trim(),
            starRating: Cypress.$('.star-rating')[index].classList[1].trim()
        }
        cy.writeFile('booksBasicDetails',book,{flag: 'a+'})

        return book
    })
})


it('Scrapes all books under Sequential Art category',() => {
    cy.visit('/catalogue/category/books/sequential-art_5/index.html')
    getPaginatedSearchResults()
})