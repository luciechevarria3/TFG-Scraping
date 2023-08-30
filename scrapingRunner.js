/// PROGRAMA QUE INICIARÁ LOS SCRAPERS

// EJECUCIÓN: node scrapingRunner.js

// Posibilidad de elegir qué scraper o scrapers ejecutar??
import { exec } from "child_process";

const nExts = 12

/// PROCESO PARA EJECUTAR SCRAPER DE CHROME (argumento: nº de extensiones a scrapear)
const chromeChild = exec(
  `node ./chromeScraper/chromeScraper.js ${nExts}`,
  function (error, stdout, stderr) {
    console.log("\n stdout: " + stdout);
    console.log("\n stderr: " + stderr);
    if (error !== null) {
      console.log("exec error: " + error);
    }
  }
);

/// PROCESO PARA EJECUTAR SCRAPER DE EDGE (argumento: nº de extensiones a scrapear)
const edgeChild = exec(
  `node ./edgeScraper/edgeScraper.js ${nExts}`,
  function (error, stdout, stderr) {
    console.log("\n stdout: " + stdout);
    console.log("\n stderr: " + stderr);
    if (error !== null) {
      console.log("exec error: " + error);
    }
  }
);

/// PROCESO PARA EJECUTAR SCRAPER DE FIREFOX (argumento: nº de extensiones a scrapear)
const firefoxChild = exec(
  `node ./firefoxScraper/firefoxScraper.js ${nExts}`,
  function (error, stdout, stderr) {
    console.log("\n stdout: " + stdout);
    console.log("\n stderr: " + stderr);
    if (error !== null) {
      console.log("exec error: " + error);
    }
  }
);
