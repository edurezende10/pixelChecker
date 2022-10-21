const puppeteer = require('puppeteer');
const tikTokValidation = require('./tiktokValidation');
let express = require('express')
var cors = require('cors')
const port = process.env.PORT || 3000

let app = express()
let url
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/', function (req, res, next) {
  url = req.body.url
  //res.json(req.body.url)
  runScript(url)
  res.send('ok')

})
app.get('/', function (req, res) {
  res.send('hello world')
})
app.listen(port)





const scriptUrlPatterns = [
  '*'
]

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
      tikTokValidation(eventParams, eventName)

    }
  });
}


const runScript = async function (url) {
  const browser = await puppeteer.launch({
    headless: false,
    //headless: 'chrome',
    defaultViewport: null,
    devtools: true,
  });
  const page = (await browser.pages())[0];
  await page.goto('https://lcgbr-ecom.vercel.app/');
  await interceptRequestsForPage(page);
}
