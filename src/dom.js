/**
 * dom.js
 * Module for creating UI (Bootstrap 5) applications with Cloudflare Workers
 */

String.prototype.capitalizeFirstChar = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

export class HtmlElement {
    constructor(args) {
        this.tag = args.tag || ''
        this.attributes = args.attributes || {}
        this.content = args.content || ''
        this.parent = args.parent || {}
        this.children = args.children || []
    }
    set tag(tag) {
        const htmlTags = ["!--...--", "!DOCTYPE", "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "search", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]
        this._tag = htmlTags.includes(tag) ? tag : 'div'
    }
    get tag() {
        return this._tag
    }
    set attributes(attr) {
        this._attributes = attr
    }
    get attributes() {
        let output = ''
        for (const [key, value] of Object.entries(this._attributes))
            output = ` ${key}="${value}"`
        return output
    }
    set content(content) {
        this._content = content
    }
    get content() {
        return this._content
    }
    set parent(parent) {
        this._parent = parent
    }
    get parent() {
        return this._parent
    }
    addChild(child) {
        if (!this._children.includes(child))
            this._children.push(child)
    }
    set children(children) {
        this._children = children
    }
    get children() {
        return this._children
    }
    renderChildren() {
        let output = ''
        for (const each of this.children)
            output += ` ${each.render()} `
        return output
    }
    render() {
        return `<${this.tag}${this.attributes}>${this.content}</${this.tag}>`
    }
}

export class FormInput extends HtmlElement {
    static fieldWrapper = args => {
        const _args = { ...args }
        const id = _args.id || 'page_form'
        const content = _args.content || ''
        return `<div class="mb-3" id="${id}">${content}</div>`
    }
    constructor(args) {
        super(args)
        this.key = args.key || ''
        this.type = args.type || 'input'
        this.label = args.label || 'Field'
        this.options = args.options || []
        this.value = args.value || ''
        this.placeholder = args.placeholder || ''
    }
    set key(key) {
        this._key = key
    }
    get key() {
        return this._key
    }
    set type(type) {
        const typeList = ['select', 'input', 'textarea']
        const reformattedType = type.trim().toLowerCase()
        this._type = typeList.includes(reformattedType) ? type : "input"
    }
    get type() {
        return this._type
    }
    set label(label) {
        this.formattedLabel = label.trim().capitalizeFirstChar()
        this._label = label
    }
    get label() {
        return 0
    }
    render() {
        const fieldTypes = {
            'select': () => {
                const id = this.id
                const key = this.key
                const label = this.label
                //  options = {
                //      'key': 'value',
                //      'user_id': 'User ID'
                //  }
                const options = this.options
                let content = `<label class="border-0" id="${id}_label">${label}</label>
                    <select id="${id}_field" name="${key}" class="form-control border" style="cursor:auto;box-sizing:border-box;height:40.5px" type="select">`
                for (const { key, value } of options) {
                    const isActive = value == this.value ? ' active' : ''
                    content += `<option value="${key}"${isActive}>${value}</option>`
                }
                content += `</select>`
                return fieldWrapper({ id: id, content: content })
            },
            'textarea': () => {
                const id = this.id || ''
                const key = this.key || ''
                const label = this.label || ''
                const placeholder = this.placeholder || ''
                let content = `
                    <label class="border-0" id="${id}_label">${label}</label>
                    <textarea style="min-height:7.55rem;" rows="4" id="${id}_field" name="${key}" class="form-control border">${placeholder}</textarea>`
                return fieldWrapper({ id: id, content: content })
            },
            'input': () => {
                return 0
            }
        }
        return fieldTypes[this.type]
    }
}

export class Form extends HtmlElement {
    constructor(args) {
        super(args)
        this._args = { ...args }
        this.form_html = ''
        this.field_length = this._args.fields ? this._args.fields.length : 0
        this.method = this._args.method || 'GET'
        this.action = this._args.action || '#'
        //  this.fields is an array of objects
        //      { id, type, label, placeholder, options }
        this.fields = this._args.fields || []
        delete this._args
    }
    addField = field => {
        return this.fields.push(field)
    }
    render() {
        let form_html = `<form id="${this.id} class="mx-auto col-lg-9 col-md-11" action="${this.action}" method="${this.method}">`
        for (const each of this.fields)
            form_html += new FormInput(each)
        return this.form_html = form_html + '</form>'
    }
}

export class Page extends HtmlElement {
    static headerDef = ''
    static footerDef = ''
    static setDefs(args) {
        if (args.header)
            Page.setHeaderDef(args.header)
        if (args.footer)
            Page.setFooterDef(args.footer)
    }
    static setHeaderDef(_headerDef) {
        Page.headerDef = _headerDef
    }
    static setFooterDef(_footerDef) {
        Page.footerDef = _footerDef
    }
    constructor(args) {
        super(args)
        this.siteTitle = args.siteTitle.capitalizeFirstChar() || 'Default'
        this.pageTitle = args.pageTitle.capitalizeFirstChar() || 'Page'
        this.header = { headerTitle: `${this.siteTitle} | ${this.pageTitle}`, headerOverwrite: args.headerOverwrite || null }
        this.brand = this.siteTitle
        this.navbar = args.navbar || [{}]
        this.body = args.body || 'Bootstrap 5 Starter'
        this.footer = args.footer || Page.footerDef
        this.parent = args.parent || {}
        this.children = args.children || []
        this.tag = 'html'
    }
    get headerDef() {
        return Page.headerDef
    }
    get footerDef() {
        return Page.footerDef
    }
    set header(args) {
        this._headerTitle = args.headerTitle
        if(args.headerOverwrite)
            this._headerOverwrite = args.headerOverwrite
    }
    get header() {
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf8" />
                <title>${this._headerTitle}</title>
                ${this._headerOverwrite || Page.headerDef}
            </head>`
    }
    set navbar(navbar) {
        this._navbar = navbar
    }
    get navbar() {
        const generateDropdown = (args) => {
            const _args = { ...args }
            const text = _args.text || ''
            const links = _args.links || []
            let responseHtml = `
    <li class="nav-item dropdown">
    <a id="navbar_dropdown_item" class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">${text}</a>
    <ul class="dropdown-menu border shadow-lg">`
            for (const each of links)
                if (each.text == 'hr')
                    responseHtml += `<hr style="color:#533; margin:0; padding:0;">`
                else
                    responseHtml += `<li><a class="dropdown-item" target="${each.target || '_self'}" href="${each.link || '#'}">${each.text || ''}</a></li>`
            return responseHtml + `</ul>
        </li>`
        }
        const brand = this.brand
        const dropdowns = this._navbar || [{}]
        let dropDownHtml = ''
        for (const each of dropdowns)
            dropDownHtml += generateDropdown(each)
        return `
<nav class="navbar navbar-expand-lg bg-primary bg-gradient sticky-top shadow-lg">
    <div class="col-10 container-fluid">
    <button class="my-1 navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><i class="fa-solid fa-bars"></i></button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <a id="navbar_banner_button" class="fs-5 navbar-brand hide-on-shrink" href="/">${brand}</a>
        <ul class="navbar-nav ms-auto">
        ${dropDownHtml}
        </ul>
    </div>
    </div>
</nav>
`
    }
    set body(content) {
        const body = `
    <body>
        <div class="main">
            <div class="container my-5 py-3 ihcc-light-grey shadow-lg ihcc-left-bar col-lg-6 col-11">
                <div class="row">
                    <div class="mx-auto">
                        ${content}
                        ${this.renderChildren()}
                    </div>
                </div>
            </div>
        </div>`
        this.content = body
    }
    get body() {
        return this.content
    }
    set footer(content) {
        this._footer = content
    }
    get footer() {
        return `${this._footer}
    </body>
 </html>`
    }
    render() {
        const render = this.header + this.navbar + this.body + this.footer 
        return render
    }
}