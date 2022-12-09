Cypress.Commands.add('register', () => {
    const apiUrl = Cypress.env('apiUrl')
    const username = `cy${Math.random().toString().slice(2, 11)}`
    const email = `${username}@mailinator.com`
    const password = Cypress.env('password')

    cy.request({
        url: `${apiUrl}/users`,
        method: 'POST',
        body: {
            user: {
                username: username,
                email: email,
                password: password
            }
        }
    })
        .then((response) => {
            expect(response.status).to.eq(200)
            window.localStorage.setItem('jwtToken', response.body.user.token)

            cy.log('**user created**')
            cy.log(`**email: ${email}**`)
            cy.log(`**password: ${password}**`)
        })
        .then(() => ({
            email: email,
            username: username
        }))
})
