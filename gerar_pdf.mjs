import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.join(__dirname, 'index.html');
const pdfFile  = path.join(__dirname, 'vitapet_site.pdf');

console.log('🚀 Iniciando geração do PDF...');

const browser = await puppeteer.launch({
  executablePath: edgePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ],
});

const page = await browser.newPage();

// Carrega o HTML local
await page.goto(`file:///${htmlFile.replace(/\\/g, '/')}`, {
  waitUntil: 'networkidle0',
  timeout: 30000,
});

// Aguarda um pouco para animações CSS carregarem
await new Promise(r => setTimeout(r, 1500));

await page.pdf({
  path: pdfFile,
  format: 'A4',
  printBackground: true,
  margin: { top: '10mm', bottom: '10mm', left: '8mm', right: '8mm' },
  scale: 0.85,
});

await browser.close();

console.log(`✅ PDF gerado com sucesso: ${pdfFile}`);
