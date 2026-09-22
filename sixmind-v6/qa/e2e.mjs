import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1200},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{ if(m.type()==='error') errors.push('console: '+m.text()); });
await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle',timeout:60000});
await page.screenshot({path:'qa-artifacts/home-desktop.png',fullPage:true});
for (const selector of ['#hero','#problems','#solutions','#demo','#journey','#method','#cases','#faq']) {
  if(!(await page.locator(selector).count())) errors.push('missing '+selector);
}
await page.locator('[data-scenario="saude"]').click();
await page.waitForTimeout(200);
if(!(await page.locator('#chat .bubble').count())) errors.push('demo chat did not render');
await page.locator('#faq .faq-q').first().click();
await page.waitForTimeout(100);
await page.screenshot({path:'qa-artifacts/faq-open.png',fullPage:false});
await page.setViewportSize({width:390,height:844});
await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle',timeout:60000});
await page.screenshot({path:'qa-artifacts/home-mobile.png',fullPage:true});
if(errors.length){ console.error(errors.join('\n')); await browser.close(); process.exit(1); }
await fs.writeFile('qa-artifacts/result.txt','E2E OK\n','utf8');
await browser.close();
console.log('E2E OK');
