// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const crypto = require('crypto');
const { Client } = require('pg')
const scripts = require('yesql')('cypress/fixtures', { type: 'pg' })

const sha256 = crypto.createHash('sha256');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const cache = {
  estado: { $$key: 'sigla' },
  conselho_profissional: { $$key: 'sigla' },
  grau_participacao: { $$key: 'codigo' },
  convenio: { $$key: 'nome_ascii' },
  especialidade: { $$key: 'nome_ascii' },
  nivel_profissional: { $$key: 'descricao' },
};

const [DOMINGO, SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO] = Array(7).fill().map((_, i) => i);

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const buildCaches = async (client, cache) => {
    for (const [tabela, cacheObj] of Object.entries(cache)) {
      console.log(`Building cache for table ${tabela}`);

      (await client.query(`SELECT * FROM ${tabela}`)).rows.forEach((el, idx) => {
        const key = el[cacheObj.$$key];

        // console.log(`key: ${key}, el: ${el}`);

        cacheObj[key] = el;
      });
    }
  };

  on('task', {
    /**
     * @param {*} args
     */
    seedOrganizacao(args) {
      return new Promise(async (resolve) => {
        const client = new Client();

        client.connect();

        const config = {
          organizacao_nome: '[CYPRESS] Clinica de Automacao via Cypress',
          clinica_nome: '[CYPRESS] Clinica de Automacao via Cypress',
          numero_cnes: '123123',
          usuario_email: 'admin@cypress.com',
          clinica_email: 'admin@cypress.com',
          criar_consulta: true,
          cod_merge_consulta: 'CLINIC-CYPRESS=1',
          cod_merge: 'CLINIC-CYPRESS'
        };

        const clinicas = (await client.query(
          `SELECT id FROM clinica WHERE nome_ascii = $1`,
          [config.clinica_nome]
        )).rows;

        console.log(clinicas);

        if (clinicas.length > 0) {
          await client.query('UPDATE clinica SET configurada = false WHERE id = $1', [clinicas[0].id]);

          resolve(clinicas);

          return;
        }

        console.log('Criando clínica/organização');

        await client.query('BEGIN');

        const agendas = {};
        const profissionais = {};
        const profissionaisCorpoClinico = {};
        const convenioParticular = cache.convenio['PARTICULAR'];
        const clinicaMedica = cache.especialidade['CLINICA MEDICA'];

        console.log(cache.convenio);
        console.log(cache.especialidade);

        const [clinicaOrganizacao] = (await client.query(scripts.createOrganizacaoClinica(config))).rows;
        const [configuracao_clinica_id, convenio_id, especialidade_id] = [
          clinicaOrganizacao.configuracao_clinica_id, convenioParticular.id, clinicaMedica.id
        ];

        await client.query(scripts.insertConfiguracaoClinicaEspecialidade({
          configuracao_clinica_id,
          especialidade_id
        }));
        await client.query(scripts.insertVinculoEspecialidadeConvenio({
          configuracao_clinica_id,
          convenio_id,
          especialidade_id
        }));
        await client.query(scripts.insertVinculoConvenioClinica({
          configuracao_clinica_id,
          convenio_id,
          codigo_operadora: null
        }));

        // (await client.query(clinic.insertProfissionalDefault())).rows.forEach((el, idx) => {
        //   profissionais[el.nome] = el;
        // });

        (await client.query(scripts.insertProfissional({
          conselho_profissional_id: cache.conselho_profissional['CRM'].id,
          especialidade_id: cache.especialidade['CLINICA MEDICA'].id,
          estado_conselho_id: cache.estado['RN'].id,
          grau_participacao_id: cache.grau_participacao['00'].id,
          nivel_profissional: cache.nivel_profissional['Superior'].valor,
          organizacao_id: clinicaOrganizacao.organizacao_id,

          nome: '[Cypress] Profissional I',
          nome_ascii: '[Cypress] Profissional I',
          numero_registro: '12345'
        }))).rows.forEach((el, idx) => {
          profissionais[el.id] = el;
        });

        for (const [id, profissional] of Object.entries(profissionais)) {
          await client.query(scripts.createUsuario({
            organizacao_id: clinicaOrganizacao.organizacao_id,
            clinica_id: clinicaOrganizacao.clinica_id,
            profissional_id: profissional.id,

            administrador: false,
            alterar_senha: false,
            ativo: true,
            cadastro_conluido: true,

            email: `${id}@cypress.com`,
            nome: profissional.nome,
            nome_ascii: profissional.nome_ascii,
            senha: sha256.update('homologa17').digest('hex'),
            tipo_usuario: 'PROFISSIONAL_SAUDE'
          }));

          (await client.query(scripts.insertCorpoClinico({
            clinica_id: clinicaOrganizacao.clinica_id,
            profissional_id: profissional.id,
            restricao_convenio: false
          }))).rows.forEach((el, idx) => {
            profissionaisCorpoClinico[el.id] = el;
          });

          for (const [id, corpoClinico] of Object.entries(profissionaisCorpoClinico)) {
            await client.query(scripts.insertCorpoClinicoEspecialidade({
              corpo_clinico_id: corpoClinico.id,
              especialidade_id: clinicaMedica.id
            }));
          }

          (await client.query(scripts.insertAgenda({
            clinica_id: clinicaOrganizacao.clinica_id,
            organizacao_id: clinicaOrganizacao.organizacao_id,
            profissional_id: profissional.id,

            agendamento_multiplo: true,
            ativo: true,
            considerar_feriado: true,
            data_inicio: null,
            data_validade: null,
            hora_abertura: '08:00',
            hora_fechamento: '20:00',
            maximo_convenio: null,
            maximo_encaixe: 0,
            maximo_por_dia: 24,
            maximo_retorno: 0,
            maximo_secao: 24,
            nome: `Agenda Dr. ${profissional.nome}`,
            nome_ascii: `Agenda Dr. ${profissional.nome_ascii}`,
            observacao: null,
            pre_agendamento_ativo: false,
            pre_consulta_ativo: true,
            restringir_agendamentos_procedimentos: true,
            tipo_agendamento_multiplo: null,
            tipo_horario: 'GERAL'
          }))).rows.forEach((el, idx) => {
            agendas[el.nome_ascii] = el;
          });

          for (const [nome, agenda] of Object.entries(agendas)) {
            for (const dia of [DOMINGO, SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO]) {
              await client.query(scripts.insertAgendaDiaSemana({
                agenda_id: agenda.id,
                dias_semana_integer: dia
              }));
            }
          }
        }

        client.query(scripts.insertNegociacaoConvenio({
          convenio_id: convenioParticular.id,
          especialidade_id: clinicaMedica.id,
          organizacao_id: clinicaOrganizacao.organizacao_id,
          clinica_id: clinicaOrganizacao.clinica_id,
          procedimento_id: clinicaOrganizacao.consulta_procedimento_id,
          cadastrado_por_id: clinicaOrganizacao.usuario_id,

          negociar_por: 'ESPECIALIDADE',
          valor: 0.01
        }));

        await client.query('END');

        await client.end();

        resolve(clinicaOrganizacao);
      });
    },
    /**
     * @param {*} args
     */
    seed(args) {
      return new Promise(async (resolve) => {
        const client = new Client();

        client.connect();

        await client.query('BEGIN');

        await client.query(scripts.insertParametrosDefault());
        await client.query(scripts.insertNiveisProfissionais());
        await client.query(scripts.insertGrausParticipacao());
        await client.query(scripts.insertConselhos());
        await client.query(scripts.insertEstados());
        await client.query(scripts.insertConvenio({
          ativo: true,
          tipo_autorizacao_por_sessao: 'POR_SESSAO',
          particular: true,
          nome: 'PARTICULAR',
          nome_ascii: 'PARTICULAR'
        }));

        await client.query(scripts.insertEspecialidade({
          nome: 'CLÍNICA MÉDICA',
          nome_ascii: 'CLINICA MEDICA',
          ativo: true, cbos: ''
        }));

        await buildCaches(client, cache);

        // console.log(cache);

        await client.query('END');

        await client.end();

        resolve({});
      });
    }
  });
}
