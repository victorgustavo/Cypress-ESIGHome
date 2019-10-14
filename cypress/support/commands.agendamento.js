import { selectizeSelect } from './util'

Cypress.Commands.add('selecionarClinica', (clinica) => {
    cy.get('[data-cy="autenticacao.clinica"]')
        .contains(clinica)
        .click();
});

Cypress.Commands.add('selecionarAgenda', (agenda) => {
    selectizeSelect('[data-cy="agendamento.agenda"]', `${agenda}`);
});

Cypress.Commands.add('selecionarData', { prevSubject: true }, (subject, data, format = 'DD/MM/YYYY') => {
    var timestamp = Cypress.moment(data, format)
        .subtract('hours', 3)
        .toDate()
        .getTime();

    cy.get('[data-cy="agendamento.datepicker"]')
        .find(`[data-date="${timestamp}"]`)
        .click({ force: true });
});

Cypress.Commands.add('selecionarHorario', { prevSubject: true }, (subject, horario, format = 'HH:ii') => {
    cy.get('[data-cy="agendamento.horario"]')
        .contains(`${horario}`)
        .dblclick({ force: true });
});

Cypress.Commands.add('preencherAgendamento', { prevSubject: true }, (subject, opts = {}) => {
    selectizeSelect('[data-cy="agendamento.especialidade"]', opts.especialidade);

    selectizeSelect('[data-cy="agendamento.convenio"]', opts.convenio);

    selectizeSelect('[data-cy="agendamento.procedimento"]', opts.procedimento);

    const autocomplete = cy.get('[data-cy="agendamento.paciente"]')
        .click()
        .type(`${opts.paciente.nome || opts.paciente}`);

    if (typeof opts.paciente == 'object') {
        cy.get('.ui-autocomplete')
            .contains(opts.paciente.nome)
            .should('contains.text', opts.paciente.nome)
            .click();
    }

    cy.get('[data-cy="agendamento.telefone"]')
        .click()
        .type(`${opts.telefone}`);
});

Cypress.Commands.add('agendar', { prevSubject: true }, (subject) => {
    cy.get('[data-cy="agendamento.salvar"]').click();
});
