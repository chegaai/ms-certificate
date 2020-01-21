import { render } from 'ejs'
import puppeteer from 'puppeteer'

export type ScreenshotOptions = {
    html: string,
    timeout?: number
}

export type renderData = {
    event: {
        name: string,
        date: Date,
        workload: number
    },
    user: {
        name: string
    }
}

export async function renderTemplate (template: string, data: renderData): Promise<string> {
    return render(template, data)
}

export async function screenshotFromHtml ({ html, timeout = 2000 }: ScreenshotOptions) {
    const browser = await puppeteer.launch({
      headless: !process.env.DEBUG_HEADFULL,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    })
  
    const page = await browser.newPage()
  
    // Set viewport to something big
    // Prevents Carbon from cutting off lines
    await page.setViewport({
      width: 2560,
      height: 1080,
      deviceScaleFactor: 2
    })
  
    page.setContent(html)

    const base64 = await page.screenshot({ encoding: "base64" }) as string;
  
    // Wait some more as `waitUntil: 'load'` or `waitUntil: 'networkidle0'
    // is not always enough, see https://goo.gl/eTuogd
    await page.waitFor(timeout)
    // Close browser
    await browser.close()
  
    return base64
}