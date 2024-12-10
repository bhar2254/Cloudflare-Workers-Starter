
import { Hono } from 'hono'
import { Page, applyCSSTheme } from './dom'
import { rawHtmlResponse } from './std'

const router = new Hono()

//	route handler
router.get('/', async c => {
    const pageDefaults = c.get('pageDefaults')
    const { header } = pageDefaults
	const page = new Page({
		page_title: 'Home',
		headerOverwrite: header + applyCSSTheme('green'),
		body: `<div class="p-3 text-center"><h2>Hello World!</h2<</div><br>
				<img class="p-3 mx-auto d-block rounded" src="https://blaineharper.com/assets/favicon.ico" style="max-width:100%; max-height: 25rem">`
	})
	return rawHtmlResponse(page.render())
})

const bodyWrapper = (x) => {
    return `<div class="p-5">${x}</div>`
}

router.get('/developer', async c => {
    const pageDefaults = c.get('pageDefaults')
    const { header } = pageDefaults
	const page = new Page({
		pageTitle: 'Developer', headerOverwrite: header + applyCSSTheme('purple'),
		body: bodyWrapper(`Hi! My name's Blaine. I make websites and other JavaScript applications. If you're interested in creating your own JavaScript projects like this one, check out my <a href="https://github.com/bhar2254">GitHub</a> or check out my site <a href="https://blaineharper.com">BlaineHarper.com</a> for (possibly?) up to date details.</div>`)
	})
	return rawHtmlResponse(page.render())
})

router.get('/projects', async c => {
    const pageDefaults = c.get('pageDefaults')
    const { header } = pageDefaults
	const page = new Page({
		pageTitle: 'Projects', headerOverwrite: header + applyCSSTheme('blue'),
		body: bodyWrapper(`If you'd like to view my other projects, check out my <a href="https://github.com/bhar2254">GitHub</a>!</div>`)
	})
	return rawHtmlResponse(page.render())
})

router.notFound(c => {
	const page = new Page({
		pageTitle: '404 | Not Found!',
		body: bodyWrapper(`<span class="fs-3">404 Not Found!</span> <hr> PAGE NOT FOUND! Head <a href="/">home</a> to try and find what you're looking for.</div>`)
	})
	return rawHtmlResponse(page.render())
})

export default router