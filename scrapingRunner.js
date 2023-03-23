/// PROGRAMA QUE INICIARÁ LOS SCRAPERS
// Posibilidad de elegir qué scraper o scrapers ejecutar??
import { exec } from 'child_process';

/// PROCESO PARA EJECUTAR SCRAPER DE CHROME
const chromeChild = exec('node ./chromeScraper/chromeScraper.js',
function (error, stdout, stderr) {
  console.log('\n stdout: ' + stdout);
  console.log('\n stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

/// PROCESO PARA EJECUTAR SCRAPER DE EDGE
const edgeChild = exec('node ./edgeScraper/edgeScraper.js',
function (error, stdout, stderr) {
  console.log('\n stdout: ' + stdout);
  console.log('\n stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

/// PROCESO PARA EJECUTAR SCRAPER DE FIREFOX
const firefoxChild = exec('node ./firefoxScraper/firefoxScraper.js',
function (error, stdout, stderr) {
  console.log('\n stdout: ' + stdout);
  console.log('\n stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});