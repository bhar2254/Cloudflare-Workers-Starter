/**
 * worker.ts
 * A Cloudflare edge hosted Worker for Bootstrap UI development.
 */

//  Import modules
import { rawHtmlResponse } from './std'
import { Page } from './dom'
import { Hono } from 'hono'

var ENV = {
	siteTitle: 'CF Starter Demo',
	brand: 'Cloudflare Starter Worker Demo',
	copyright: 'Blaine Harper',
	navbar: [{
		text: 'About',
		links: [{
			text: 'Developer',
			link: '/developer'
		}, {
			text: 'Other Projects',
			link: '/projects'
		}],
	}]
}

// 	set application default's for page generation
//	Page will use this as the default contents for <head></head> unless overwritten with Page.header
const _headerDef = `<meta name = "viewport" content = "width=device-width,initial-scale=1"/>
	<link rel="icon" type="image/x-icon" href="https://blaineharper.com/assets/favicon.ico">

	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://bhar2254.github.io/src/css/ltc/bs.add.css">

	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"><\/script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"><\/script>
	<script src="/js/jQuery.dirty.js"><\/script>
	<script src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.13.4/b-2.3.6/b-html5-2.3.6/b-print-2.3.6/datatables.min.js"><\/script>
	<script src="https://kit.fontawesome.com/5496aaa581.js" crossorigin="anonymous"><\/script>`

const _copyright = `<span id = "footerText"><span id="year"></span> © ${ENV.copyright}</span>
	<script>document.getElementById("year").innerHTML = new Date().getFullYear();</script>`

const _footerDef = `<div class="mx-auto">
		<div id="footer_motto" class="mx-auto ihcc-left-bar p-3 shadow-lg ihcc-sand bg-gradient text-center panel rounded-0" style="width:15%; min-width:10rem; margin-bottom:7.5rem;">
			<i>Start your own Cloudflare worker site <a href="https://github.com/bhar2254/Cloudflare-Workers-Starter">here!</a></i>
		</div>
		</div >
	</div >
	<footer id="mainFooter" class="mx-auto shadow-lg p-2 text-center ihcc-light-grey bg-gradient sticky-footer">
		${_copyright}
	</footer>	
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"><\/script>`

const pageDefaults = {
	...ENV, 
	header: _headerDef, 
	footer: _footerDef,
}
Page.setDefs(pageDefaults)

const applyCSSTheme = (scheme) => {
	const hexToRBG = (hex) => {
		// Ensure the hex code is exactly 2 digits
		if (hex.length !== 6) {
			throw new Error('Invalid hex color format. It should be 6 digits.');
		}
		let output = parseInt(hex, 16)
		output = Math.floor(output)
		output = Math.min(255, Math.max(0, output))
		const rDecimalValue = parseInt(hex.substring(0, 2), 16)
		const gDecimalValue = parseInt(hex.substring(2, 4), 16)
		const bDecimalValue = parseInt(hex.substring(4, 6), 16)

		// Use the decimal value for each RGB component to create a shade of gray
		return `${rDecimalValue}, ${gDecimalValue}, ${bDecimalValue}`
	}
	if (!Object.keys(colors).includes(scheme))
		scheme = 'purple'
	const rbgPrimary = `${hexToRBG(colors[scheme].primary)}`
	const rbgSecondary = `${hexToRBG(colors[scheme].secondary)}`
	return `
		<style>
		:root{
			--bh-primary: #${colors[scheme].primary};
			--bh-primary-rgb: ${rbgPrimary};
			--bh-secondary: #${colors[scheme].secondary};
			--bh-secondary-rgb: ${rbgSecondary};
		}
		</style>`
}

const app = new Hono()

//	route handler
app.get('/', async c => {
	const page = new Page({
		page_title: 'Home',
		headerOverwrite: _headerDef + applyCSSTheme('green'),
		body: `<div class="p-3 text-center"><h2>Hello World!</h2<</div><br>
				<img class="p-3 mx-auto d-block rounded" src="https://blaineharper.com/assets/favicon.ico" style="max-width:100%; max-height: 25rem">`
	})
	return rawHtmlResponse(page.render())
})

app.get('/developer', async c => {
	const page = new Page({
		pageTitle: 'Developer', headerOverwrite: _headerDef + applyCSSTheme('purple'),
		body: `Hi! My name's Blaine. I make websites and other JavaScript applications. If you're interested in creating your own JavaScript projects like this one, check out my <a href="https://github.com/bhar2254">GitHub</a> or check out my site <a href="https://blaineharper.com">BlaineHarper.com</a> for (possibly?) up to date details.`
	})
	return rawHtmlResponse(page.render())
})

app.get('/projects', async c => {
	const page = new Page({
		pageTitle: 'Projects', headerOverwrite: _headerDef + applyCSSTheme('blue'),
		body: `If you'd like to view my other projects, check out my <a href="https://github.com/bhar2254">GitHub</a>!`
	})
	return rawHtmlResponse(page.render())
})

app.notFound(c => {
	const page = new Page({
		pageTitle: '404 | Not Found!',
		body: `<span class="fs-3">404 Not Found!</span> <hr> PAGE NOT FOUND! Head <a href="/">home</a> to try and find what you're looking for.`
	})
	return rawHtmlResponse(page.render())
})

export default app