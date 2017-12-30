const puppeteer = require('puppeteer')
const moment = require('moment')
const args = process.argv.slice(2);

const OTC = `https://otcbtc.com/sell_offers?currency=eos&fiat_currency=cny&payment_type=all`

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

    if (args.length) {
        args.forEach(async (arg, index) => {
            if (Number(result[0]) <= Number(arg)) {
                for (i = 0; i < 5 - index; i++){
                    process.stdout.write('\x07');
                    await sleep(200);
                }
            }
        })
    }
    console.log(`首页的价格分别是 ${result.join(', ')}； 时间是 ${moment().format('HH:mm:ss')}`)

    await page.close()
}

const main = async () => {
    while (true) {
        try {
            await fetchEosPrice()
            await sleep(40000)
        } catch (e) {
            console.log(e)
            continue
        }
    }
}

main()
