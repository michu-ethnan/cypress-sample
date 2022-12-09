import profile from '../selectors/profile.sel'

describe('Profile page', () => {
    beforeEach(() => {
        cy.register().then((response) => {
            cy.wrap(response.username).as('username')
        })
    })

    it('contains correct elements', function () {
        cy.visit(`/@${this.username}`)
        cy.get(profile.editProfileButton).should('be.visible')
            .and('have.attr', 'href', '#/settings')
        cy.get(profile.userInfoArea).should('be.visible')
        cy.get(profile.myArticlesTab).should('be.visible')
            .and('have.css', 'color', 'rgb(92, 184, 92)')
        cy.get(profile.favouritedArticlesTab).should('be.visible')
    })

    it('can see created articles', function () {
        cy.createArticle()
        cy.visit(`/@${this.username}`)
        cy.get(profile.articles).should('be.visible')
            .and('have.length', 1)
            .and('contain', 'Article created by Cypress test')
    })

    it('can see favorited articles', function () {
        const apiUrl = Cypress.env('apiUrl')
        cy.createArticle().then((link) => {
            cy.request({
                method: 'POST',
                url: `${apiUrl}/articles/${link}/favorite`,
                headers: {
                    authorization: `Token ${window.localStorage.getItem('jwtToken')}`
                }
            })
        })
        cy.visit(`/@${this.username}`)
        cy.get(profile.favouritedArticlesTab).click()
        cy.get(profile.articles).should('be.visible')
            .and('have.length', 1)
            .and('contain', 'Article created by Cypress test')
    })

    it('can see favorited articles - mock response', function () {
        const apiUrl = Cypress.env('apiUrl')
        cy.intercept(`${apiUrl}/articles?favorited=${this.username}&limit=5&offset=0*`, {
            fixture: 'favorited_list'
        })
        cy.visit(`/@${this.username}`)
        cy.get(profile.favouritedArticlesTab).click()
        cy.get(profile.articles).should('be.visible')
            .and('have.length', 1)
            .and('contain', 'My Cypress article')
    })
})
