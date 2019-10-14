
import { selectizeSelect } from '../support/util'

const moment = Cypress.moment

describe('Agendamentos', () => {
    before(() => {
        cy.clearCookies()
    });

    // TODO: extrair dados para .js específico
    const data = {
        perfis: {
            recepcao: {
                nome: 'Recepção',
                login: 'recepcao2@esig.com.br',
                senha: 'homologa17',
                pacientes: {
                    pacienteNovo: {
                        nome: `[${moment().unix()}] Paciente (recepção)`,
                        nascimento: '01/02/2003',
                        sexo: 'Masculino'
                    }
                }
            },
            profissional: {
                nome: 'Profissional',
                login: 'medico@esig.com.br',
                senha: 'homologa17',
                pacientes: {
                    pacienteNovo: {
                        nome: `[${moment().unix()}] Paciente (profissional)`,
                        nascimento: '01/02/2003',
                        sexo: 'Masculino'
                    }
                }
            }
        }
    };

    Object.entries(data.perfis).forEach(([id, perfil]) => {
        context(`Perfil ${perfil.nome}`, () => {
            before(() => {
                cy.logar(perfil.login, perfil.senha);
            });

            beforeEach(function () {
                Cypress.Cookies.preserveOnce('JSESSIONID');
            });

            Object.entries(perfil.pacientes).forEach(([id, paciente]) => {
                it(`Como ${perfil.nome} devo conseguir cadastrar um novo paciente (#${id} - ${paciente.nome})`, () => {
                    cy.visit('paciente/create');

                    cy.get('[name="nome"]').type(paciente.nome);
                    cy.get('[name="dataNascimento"]')
                        .click()
                        .type(moment(paciente.nascimento).format('DDMMYYYY'));

                    selectizeSelect('#sexo', paciente.sexo);

                    cy.get('#pacienteForm')
                        .submit();

                    cy.get('.alert-success')
                        .should('contains.text', 'Cadastrado com sucesso');
                });
            });

            [perfil.pacientes.pacienteNovo].forEach((paciente) => {
                it(`Como ${perfil.nome} devo conseguir agendar paciente recém cadastrado (${paciente.nome})`, () => {
                    cy.visit('agenda/agendamentos');

                    cy.selecionarAgenda('Teste')
                        .selecionarData(moment().format('DD/MM/YYYY'))
                        .selecionarHorario('08:00')
                        .preencherAgendamento({
                            especialidade: 'CLÍNICA MÉDICA',
                            convenio: 'PARTICULAR',
                            procedimento: 'Consulta',
                            paciente,
                            telefone: '84998765432'
                        })
                        .agendar();

                    cy.get('#agendamentoModal').should('not.be.visible');
                });
            });

            it(`Como ${perfil.nome} devo conseguir agendar paciente não cadastrado`, () => {
                cy.visit('agenda/agendamentos');

                cy.selecionarAgenda('Teste')
                    .selecionarData(moment().format('DD/MM/YYYY'))
                    .selecionarHorario('08:00')
                    .preencherAgendamento({
                        especialidade: 'CLÍNICA MÉDICA',
                        convenio: 'PARTICULAR',
                        procedimento: 'Consulta',
                        paciente: `[${moment().unix()}] Paciente Não Cadastrado`,
                        telefone: '84998765432'
                    })
                    .agendar();

                cy.get('#agendamentoModal').should('not.be.visible');
            });
        });
    });
});
