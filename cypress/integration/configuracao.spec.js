import { selectizeSelect } from '../support/util'
<reference types="Cypress" />

const moment = Cypress.moment


describe('suite', () => {
    before(() => {
  //      cy.clearCookies()
    });
    
// TODO: extrair dados para .js específico
const data = {
    perfis: {
        Administrador: {
            nome: 'Administrador',
            login: 'Administrador@esig.com.br',
            senha: 'homologa17',
        }
    }
};

    it('Cadastrando Novas Clinicas', () => {
        cy.visit('https://testes-quarkclinic.esig.com.br/app/clinica/index');
        //cy.visit('entrar');
        cy.

        cy.get('[data-cy="autenticacao.email"]').clear()
            .type('administrador@esig.com.br');
        cy.get('[data-cy="autenticacao.senha"]').clear()
            .type(`${'homologa17'}{Enter}`);

        cy.get(':nth-child(2) > [data-cy="autenticacao.clinica"]').click();

        cy.visit('https://testes-quarkclinic.esig.com.br/app/clinica/index');
        cy.get('.panel-heading > .btn').click();

        // Preenchendo os dados da Clinica 
        cy.get('#nome').type('NovaClinica');
        cy.get('.col-sm-6 > .selectize-control > .selectize-input').first();
      });
      
});