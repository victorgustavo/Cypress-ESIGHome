/// <references types="Cypress" />

describe('Trabalhe conosco Esig', ()=>{
    it('Inscrevendo-se para uma vaga',()=>{
        cy.visit('https://www.esig.com.br/portal/');
        cy.get('.right > :nth-child(6) > a').click({ force: true });

        cy.get('.l9 > .titulo-interna').should('have.text','Carreiras');
    });

    it('Inscrevendo-se para uma vaga',()=>{
        cy.visit('https://www.esig.com.br/portal/');
        cy.get('.right > :nth-child(6) > a').click({ force: true });

        cy.get(':nth-child(5) > tbody > :nth-child(1) > :nth-child(4) > .waves-effect').click();

        cy.url().should('include', 'docs.google.com/forms');
    });
});