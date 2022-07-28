const puppeteer = require('puppeteer');
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
      let temp = await JSON.parse(request.postData).event
      let temp1 = await JSON.parse(request.postData).properties
      console.log(temp)
      function objetoVazio(obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) return true;
        }
        return false;
      }
      let erros = {}
      let typeCurrency = ['AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BIF', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CZK', 'DKK', 'DZD', 'EGP', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KES', 'KHR', 'KRW', 'KWD', 'KZT', 'MAD', 'MOP', 'MXN', 'MYR', 'NGN', 'NIO', 'NOK', 'NZD', 'OMR', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VES', 'VND', 'ZAR']
      let regras = {
        content_id() {
          if (temp1.hasOwnProperty('content_id') === false) {
            erros.content_id = 'Não possui content_id';
          }
        },
        value() {
          if (temp1.hasOwnProperty('value') === false) {
            if (temp1.hasOwnProperty('currency') === true) {
              erros.value = 'Possui currency e não possui value';
            }
          }
          if (temp1.hasOwnProperty('value') === true && typeof temp1.value !== 'number') {
            erros.value = 'não é do tipo number';
          }

        },
        currency() {
          if (temp1.hasOwnProperty('currency') === false) {

            if (temp1.hasOwnProperty('value') === true) {
              erros.currency = 'possui value e não possui currency';
            }
          }
          let selectCurrency = temp1.currency.toUpperCase();
          let matchCurrency
          typeCurrency.forEach((item) => {
         
            item === selectCurrency ? matchCurrency = false : matchCurrency=true;
          })
          console.log(matchCurrency)
          if (temp1.hasOwnProperty('currency') === true && matchCurrency) {
            erros.currencyType = 'currency incorreto';
          }
        }
      }
      if (objetoVazio(temp1)) {



        for (let prop in temp1) {

          for (let propRegras in regras) {
            regras[propRegras](temp1)

          }

        }
        console.log(erros)
        erros = {}
        //console.log(temp1)
      }


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

  await interceptRequestsForPage(page);



})()

//['AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BIF', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CZK', 'DKK', 'DZD', 'EGP', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KES', 'KHR', 'KRW', 'KWD', 'KZT', 'MAD', 'MOP', 'MXN', 'MYR', 'NGN', 'NIO', 'NOK', 'NZD', 'OMR', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'VES', 'VND', 'ZAR']