import login from '../selectors/login.sel'
import header from '../selectors/header.sel'

describe('Login', () => {
    context('unsuccessful', () => {
        beforeEach(() => {
            cy.visit('/login')
        })

        it('can see error message when username/password incorrect', () => {
            cy.get(login.emailField).type('random@test.com')
            cy.get(login.passwordField).type('random_pass')
            cy.get(login.signInButton).should('have.text', 'Sign in').click()
            cy.get(login.errorMessages).should('be.visible')
                .and('contain', 'email or password is invalid')
        })

        it('can see error message when API responds with 500', () => {
            const apiUrl = Cypress.env('apiUrl')

            cy.intercept('POST', `${apiUrl}/users/login`, {
                statusCode: 500,
                fixture: 'login_error'
            })
            cy.get(login.emailField).type('random2@test.com')
            cy.get(login.passwordField).type('random_pass{enter}')
            cy.get(login.errorMessages).should('be.visible')
                .and('contain', 'Error 500 - Internal server error')
        })
    })

    context('successful', () => {
        beforeEach(() => {
            cy.register().then((response) => {
                cy.wrap(response.email).as('email')
            })
            cy.clearCookies()
            cy.clearLocalStorage()
            cy.visit('/login')
        })

        it('can log in', function () {
            const password = Cypress.env('password')

            cy.get(login.emailField).type(this.email)
            cy.get(login.passwordField).type(password)
            cy.get(login.signInButton).click()
            cy.get(header.settingsLink).should('be.visible')
        })
    })
})
