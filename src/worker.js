/**
 * worker.ts
 * A Cloudflare edge hosted Worker for Bootstrap UI development.
 */

//  Import modules
import { rawHtmlResponse } from './std';
import { Page } from './dom'

//  Main function
var src_default = {
	async fetch(request, env, ctx) {
	// 	used for getting url and host information or for getParameterByName(url, name) from 'std' module
		const url = request.url
		const { host, protocol, pathname } = new URL(request.url)

	// 	set application default's for page generation
		env.navbar = [{
				text: 'About',
				links: [{
					text: 'The Developer',
					link: '/developer'
				},{
					text: 'Other Projects',
					link: '/projects'
				}],
			}
		]

		const _headerDef = `<meta name = "viewport" content = "width=device-width,initial-scale=1"/>
			<link rel="icon" type="image/x-icon" href="https://blaineharper.com/assets/favicon.ico">
		
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css">
			<link rel="stylesheet" href="https://parking.indianhills.edu/stylesheets/ihcc.css">
			<link rel="stylesheet" href="https://parking.indianhills.edu/stylesheets/bs.add.css">
			<link rel="stylesheet" href="https://parking.indianhills.edu/stylesheets/bs.add.dev.css">
		
			<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"><\/script>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"><\/script>
			<script src="/js/jQuery.dirty.js"><\/script>
			<script src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.13.4/b-2.3.6/b-html5-2.3.6/b-print-2.3.6/datatables.min.js"><\/script>
			<script src="https://kit.fontawesome.com/5496aaa581.js" crossorigin="anonymous"><\/script>`
		
		const copyright = `<span id = "footerText"><span id="year"></span> © ${env.copyright}</span>
			<script>document.getElementById("year").innerHTML = new Date().getFullYear();</script>`

		const _footerDef = `<div class="mx-auto">
				<div id="footer_motto" class="mx-auto ihcc-left-bar p-3 shadow-lg ihcc-sand bg-gradient text-center panel rounded-0" style="width:15%; min-width:10rem; margin-bottom:7.5rem;">
					<i>Start your own Cloudflare  Worker project at <a href="https://github.com/bhar2254/cloudflare-workers-starter">here!</a></i>
				</div>
				</div >
			</div >
			<footer id="mainFooter" class="mx-auto shadow-lg p-2 text-center ihcc-light-grey bg-gradient sticky-footer">
				${copyright}
			</footer>	
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"><\/script>`

		Page.setDefs({ header: _headerDef, footer: _footerDef })

	//	route handler
		switch (pathname) {
			case "/": {
				const page = new Page({ ...env, pageTitle: 'Home', body: `Hello World!` })
				return rawHtmlResponse(page.render())
			}
			case "/developer": {
				const page = new Page({ ...env, pageTitle: 'Developer',
					body: `Hi! My name's Blaine. I make websites and other JavaScript applications. If you're interested in creating your own JavaScript projects like this one, check out my <a href="https://github.com/bhar2254">GitHub</a> or check out my site <a href="https://blaineharper.com">BlaineHarper.com</a> for (possibly?) up to date details`
				})
				return rawHtmlResponse(page.render())
			}
			case "/projects": {
				const page = new Page({ ...env, pageTitle: 'Projects',
					body: `If you'd like to view my other projects, check out my <a href="https://github.com/bhar2254">GitHub</a>!`
				})
				return rawHtmlResponse(page.render())
			}
			default: {
				const page = new Page({ ...env, pageTitle: '404',
					body: `<span class="fs-3">404</span> <hr> PAGE NOT FOUND! Head <a href="/">home</a> to try and find what you're looking for.<br><br>If you believe this is in error, contact the IT Helpdesk at helpdesk@indianhills.edu.`
				})
				return rawHtmlResponse(page.render())
			}
		}
	}
}

export {
	src_default as default
}
