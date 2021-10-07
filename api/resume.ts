import type{ VercelRequest, VercelResponse } from "@vercel/node";
import chrome from 'chrome-aws-lambda'
import puppeteer from 'puppeteer'
import { parse } from 'url'

export const generatePDF = async (url: string, token: string) => {
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === 'production'
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {}
  )
  const page = await browser.newPage()
  await page.setViewport({
    width: 1500,
    height: 2121,
    deviceScaleFactor: 2,
  })

  await page.setCookie({
    name: 'authorization',
    value: token,
    url,
    expires: Date.now() / 1000 + 10,
  })
  await page.goto(url, { waitUntil: 'networkidle2' })
  const pdf = await page.pdf({
    printBackground: true,
    path: 'resume.pdf',
    format: 'letter',
    /* Enable for margin around the content */
    margin: {
        top: '20px',
        bottom: '40px',
        left: '20px',
        right: '20px'
    }
  })

  await browser.close()
  return pdf
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const parsed = parse(req.url, true)
  req.headers.authorization = 'Bearer super-secret-hash'

  if (!parsed.query.url || !req.headers.authorization) {
    return res.end('Please provide required infos')
  }

  try {
    const pdf = await generatePDF(
      decodeURIComponent(parsed.query.url as string),
      req.headers.authorization.replace('Bearer ', '')
    )
    res.end(pdf)
  } catch (error) {
      console.log(error)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('There was an error performing the action')
  }
}
