const fs = require('fs');
const {join} = require('path');
const basePath = process.cwd();

function main() {
  const folder = join(basePath, 'output', `${new Date().getTime()}`);

  const reportJson = join(basePath, 'mochawesome.json');
  const reportFolder = join(basePath, 'mochawesome-report');
  const reportHtml = join(basePath, 'mochawesome-report', 'mochawesome.html');
  const resultsFolder = join(basePath, 'cypress', 'results');
  const videoFolder = join(basePath, 'cypress', 'videos');
  const screenshotFolder = join(basePath, 'cypress', 'screenshots');

  try {
    fs.mkdirSync(folder, {recursive: true});

    fs.renameSync(reportHtml, join(reportFolder, 'index.html'));
    fs.renameSync(reportFolder, join(folder, 'report'));
    fs.renameSync(reportJson, join(folder, 'report', 'report.json'));
    fs.renameSync(videoFolder, join(folder, 'videos'));
    fs.renameSync(resultsFolder, join(folder, 'results'));
  } catch (err) {
    console.info('Não foi possível gerar pasta de saída');
  }

  try {
    fs.renameSync(screenshotFolder, join(folder, 'screenshots'));
  } catch (err) {
    console.info('Nenhum screenshot para copiar');
  }
}

main();