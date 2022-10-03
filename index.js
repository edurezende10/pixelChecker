const puppeteer = require('puppeteer');
const tikTokValidation=require('./tiktokValidation');
const prettier = require('prettier');
const atob = require('atob');
const btoa = require('btoa');

const scriptUrlPatterns = [
  '*'
]

const requestCache = new Map();

async function interceptRequestsForPage(page) {
  const client = await page.target().createCDPSession();

  await client.send('Network.enable');

  await client.send('Network.setRequestInterception', {
    patterns: scriptUrlPatterns.map(pattern => ({
      urlPattern: pattern, resourceType: 'Ping', interceptionStage: 'HeadersReceived'
    }))
  });
  client.on('Network.requestIntercepted', async ({ interceptionId, request, responseHeaders, resourceType, status }) => {
    if (request.url == 'https://analytics.tiktok.com/api/v2/pixel') {
      let eventName = await JSON.parse(request.postData).event
      let eventParams = await JSON.parse(request.postData).properties
      tikTokValidation(eventParams,eventName)
   
    }
  });
}

(async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    devtools: true,

  });

  const page = (await browser.pages())[0];
  await page.goto('https://lcgbr-ecom.vercel.app/');

  await interceptRequestsForPage(page);



})()

