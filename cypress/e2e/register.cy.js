import registration from '../selectors/register.sel'
import header from '../selectors/header.sel'

describe('Register', () => {
   
    beforeEach(() => {
        const random = `cy${Math.random().toString().slice(2, 8)}`
        cy.wrap(random).as('username')
        cy.wrap(`${random}@mailinator.com`).as('email')
        cy.visit('/register')
    })

    it('can register a new account', function () {
        cy.get(registration.usernameField).type(this.username, { delay: 50 })
        cy.get(registration.emailField).type(this.email)
        cy.get(registration.passwordField).type('Cypress12')
        cy.get(registration.signUpButton).click()
        cy.get(header.settingsLink).should('be.visible')
    })

    it('check registration request body and response', function () {
        const apiUrl = Cypress.env('apiUrl')

        cy.intercept(`${apiUrl}/users`).as('loginRequest')
        cy.get(registration.usernameField).type(this.username)
        cy.get(registration.emailField).type(this.email)
        cy.get(registration.passwordField).type('Cypress12{enter}')

        cy.wait('@loginRequest').then((xhr) => {
            expect(xhr.request.body.user.email).to.eq(this.email)
            expect(xhr.request.body.user.password).to.eq('Cypress12')
            expect(xhr.request.body.user.username).to.eq(this.username)
            expect(xhr.response.body.user.email).to.eq(this.email)
            expect(xhr.response.body.user.token).not.to.eq(null)
        })
        cy.get(header.settingsLink).should('be.visible')
    })
})
