const puppeteer = require('puppeteer');
const notifier = require('node-notifier');

const secrets = require('./secrets.js');

const ENTRY   = 'https://ggh.magister.net/';
const username = secrets.username;
const password = secrets.password;

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']})
  const page = await browser.newPage()
  
  const navigationPromise = page.waitForNavigation().catch(e => console.log(e));
    
  await page.goto(ENTRY)
    
  await navigationPromise
  
  await page.waitForSelector('#username')
  await page.type('#username', username);
  await page.click('div > .auth-form > .form-group > #username_submit > .primary-button')
  
  await page.waitForSelector('#password');
  await page.type('#password', password);
  await page.click('.container0 > .auth-form > .form-group > #password_submit > .primary-button')
  
  await navigationPromise
    
  await page.waitForSelector('body > .header > .header-user > a > .ng-binding')
  await page.click('body > .header > .header-user > a > .ng-binding')
  
  await page.waitForSelector('#opleiding > .block > .content > .list > li:nth-child(3)');
  const element = await page.$('#opleiding > .block > .content > .list > li:nth-child(3) > span')
  const klas = await (await element.getProperty('textContent')).jsonValue();
  
  await browser.close()

  if (klas != "") {
	notifier.notify({
		title: "Nieuwe klas",
		message: `Je zit in een nieuwe klas: ${klas}`
	});
	console.log("New class!");
  } else {
	console.log("No new class");
  }
})();