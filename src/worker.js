/**
 * worker.ts
 * A Cloudflare edge hosted Worker for Bootstrap UI development.
 */

//  Import modules
import { Hono } from 'hono';
import { Page } from './dom'
import indexRouter from './index'

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
	<link rel="stylesheet" href="https://bhar2254.github.io/src/css/bs.add.css">

	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"><\/script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"><\/script>
	<script src="/js/jQuery.dirty.js"><\/script>
	<script src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.13.4/b-2.3.6/b-html5-2.3.6/b-print-2.3.6/datatables.min.js"><\/script>
	<script src="https://kit.fontawesome.com/5496aaa581.js" crossorigin="anonymous"><\/script>`

const _copyright = `<span id = "footerText"><span id="year"></span> © ${ENV.copyright}</span>
	<script>document.getElementById("year").innerHTML = new Date().getFullYear();</script>`

const _footerDef = `<div class="mx-auto">
		<div id="footer_motto" class="mx-auto bh-left-bar p-3 shadow-lg bh-sand bg-gradient text-center panel rounded-0" style="width:15%; min-width:10rem; margin-bottom:7.5rem;">
			<i>Start your own Cloudflare worker site <a href="https://github.com/bhar2254/Cloudflare-Workers-Starter">here!</a></i>
		</div>
		</div >
	</div >
	<footer id="mainFooter" class="mx-auto shadow-lg p-2 text-center bh-light-grey bg-gradient sticky-footer">
		${_copyright}
	</footer>	
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"><\/script>`

const pageDefaults = {
	...ENV, 
	header: _headerDef, 
	footer: _footerDef,
}

const app = new Hono()

app.use( (c, next) => {
	c.set('pageDefaults', pageDefaults)
	Page.setDefs(pageDefaults)
	return next()
})

app.route('/', indexRouter)

export default app