const hrefTitleSelector = 'h3 a'
const productInformationTableSelector = '[class="table table-striped"]'


const getPaginatedSearchResults = () => {
    //get random element on page to begin logic
    cy.get('h1', {log:false})
            .then( () => {
                //iterate through each href selector to scrape book details and store them in json file, then navigate back one page
                cy.get(hrefTitleSelector,{log:false})
                    .each(el => {

                        cy.wrap(el,{log:false})
                            .visit(el[0].href, {log:false})
                            .then( () => {
                            
                                cy.get('.default', {log:false})
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
                                    cy.writeFile('booksSequentialArtAllDetails',book,{flag: 'a+', log:false})
                                    return book
                                })
                            })
                            .go('back',{log:false})

                        })
                //Check if current page is last
                cy.get('.current', {log:false})
                        .then(el => {
                            const parts = el[0].innerText.split(' ')
                            const currentPage = parts[parts.length - 3]
                            const totalPages = parts[parts.length - 1]

                            if(parseInt(totalPages) > parseInt(currentPage)) {
                                cy.get( 'a:contains("next")', {log:false})
                                .then(el => {
                                    //if so then click on button and rerun book detail scraping
                                    cy.log('Clicking next page results')
                                    cy.wrap(el, {log:false})
                                        .click({log:false})
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

    cy.get('article',{log:false})
    .map((components, index) => {
        //extracts all book details and writes to file in json format
        let book = {
            title: Cypress.$(hrefTitleSelector)[index].title.trim(),
            price: Cypress.$('.price_color')[index].innerText.trim(),
            availability: Cypress.$('.instock.availability')[index].innerText.trim(),
            starRating: Cypress.$('.star-rating')[index].classList[1].trim()
        }
        cy.writeFile('booksBasicDetails',book,{flag: 'a+', log:false})

        return book
    })
})


it('Scrapes all books under Sequential Art category',() => {
    cy.visit('/catalogue/category/books/sequential-art_5/index.html')
    getPaginatedSearchResults()
})