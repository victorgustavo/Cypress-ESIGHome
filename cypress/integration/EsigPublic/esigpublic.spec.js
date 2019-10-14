/// <reference types="Cypress" />

describe('Acessar a pagina Home', function() {
    it('Visitando a Pagina Principal ESIG-HOME', function(){
        cy.visit('https://www.esig.com.br/portal/');
        cy.title().should('include','ESIG Software e Consultoria em TI | Muito além do software, inteligência e inovação');
    })

    it('Fale Conosco, enviado uma mensagem pelo fale conosco', ()=>{
        cy.visit('https://www.esig.com.br/portal/');
        cy.get('.active > .item > .valign-demo > .center-align > .waves-effect').click();

        cy.get('[name="your-name"]').type('Joselindo Arlindo Da Silva');
        cy.get('[name="your-email"]').type('Joselindo@gmail.com');
        cy.get('[name="your-subject"]').type('@Ignore');
        cy.get('[name="your-message"]').type('Mensagem enviada para ESIG.');

        cy.get('.s4 > .wpcf7-form-control').click();
        
        //cy.get('.wpcf7-response-output').should('have.text','Ocorreu um erro ao tentar enviar sua mensagem. Tente novamente mais tarde.');
        cy.get('.wpcf7-response-output').should('have.text','Mensagem enviada com Sucesso.');
        
    });

    it('Fale Conosco, submissão de formulario faltando dados', ()=>{
        cy.visit('https://www.esig.com.br/portal/');
        cy.get('.active > .item > .valign-demo > .center-align > .waves-effect').click();

        cy.get('[name="your-name"]').type('Joselindo Arlindo Da Silva');
        //cy.get('[name="your-email"]').type('Joselindo@gmail.com');
        cy.get('[name="your-subject"]').type('@Ignore');
        cy.get('[name="your-message"]').type('Mensagem enviada para ESIG.');

        cy.get('.s4 > .wpcf7-form-control').click();
        
        //cy.get('.wpcf7-response-output').should('have.text','Ocorreu um erro ao tentar enviar sua mensagem. Tente novamente mais tarde.');
        cy.get('.wpcf7-response-output').should('have.text','Um ou mais campos possuem um erro. Verifique e tente novamente.');
    });
})