const puppeteer = require('puppeteer')
const moment = require('moment')

const OTC = `https://otcbtc.com/sell_offers?utf8=%E2%9C%93&currency=eos&fiat_currency=cny&amount=&payment_type=all&commit=%E6%90%9C%E7%B4%A2%E5%85%91%E6%8D%A2`

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const fetchEosPrice = async () => {
    const browser = await puppeteer.launch()

    const page = await browser.newPage()
    await page.goto(OTC)

    await sleep(5000)

    let result = await page.evaluate(() =>  {
        const nodeList = [...document.querySelectorAll('ul.list-content .price')].slice(0, 5)

        let result = []

        for (let node of nodeList) {
            result.push(node.innerText.replace(/[^\d\.]/g, ''))
        }
        return result
    })

    console.log(`首页的价格分别是 ${result.join(', ')}； 时间是 ${moment().format('HH:mm:ss')}`)

    await page.close()
}

const main = async () => {
    while (true) {
        await fetchEosPrice()
        await sleep(60000)
    }
}

main()
