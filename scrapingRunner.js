/// PROGRAMA QUE INICIARÁ LOS SCRAPERS
// Posibilidad de elegir qué scraper o scrapers ejecutar??
import { exec } from 'child_process';

/// PROCESO PARA EJECUTAR SCRAPER DE CHROME (argumento: nº de extensiones a scrapear)
const chromeChild = exec('node ./chromeScraper/chromeScraper.js 30',
function (error, stdout, stderr) {
  console.log('\n stdout: ' + stdout);
  console.log('\n stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

/// PROCESO PARA EJECUTAR SCRAPER DE EDGE (argumento: nº de extensiones a scrapear)
const edgeChild = exec('node ./edgeScraper/edgeScraper.js 30',
function (error, stdout, stderr) {
  console.log('\n stdout: ' + stdout);
  console.log('\n stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

/// PROCESO PARA EJECUTAR SCRAPER DE FIREFOX (argumento: nº de extensiones a scrapear)
const firefoxChild = exec('node ./firefoxScraper/firefoxScraper.js 30',
function (error, stdout, stderr) {
  console.log('\n stdout: ' + stdout);
  console.log('\n stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});