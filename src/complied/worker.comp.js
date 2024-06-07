var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
};

// src/ihccStd.js
function getParameterByName(url, name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    name = name.replace(/\//g, "/");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    else if (!results[2])
        return "";
    else if (results[2]) {
        results[2] = results[2].replace(/\//g, "/");
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function rawHtmlResponse(html) {
    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8"
        }
    });
}

// src/dom.js
var HtmlElement = class {
    constructor(args) {
        const _args = { ...args };
        this.id = _args.id || "html_element";
        this.tag = _args.tag || "div";
        this.classes = _args.classes || [];
        this.style = _args.style || "";
        this.href = _args.href || "#";
        this._children = _args.children || [];
        this._content = _args.content || "";
    }
    set classes(classArray = []) {
        this.classesArray = classArray;
    }
    get classes() {
        let response2 = "";
        for (const each of this.classesArray)
            response2 += `${each} `;
        return response2;
    }
    get childHtml() {
        let response2 = "";
        for (const child of this._children)
            response2 += child.html;
        return;
    }
    set children(childArray) {
        this._children = childArray;
        return this._children;
    }
    get children() {
        return this._children;
    }
    removeChild(childElement) {
        this._children = this._children.splice(this._children.indexOf(childElement));
        return 0;
    }
    addChild(childElement) {
        this._children.push(childElement);
        return 0;
    }
    insertClass(classSingle) {
        return 0;
    }
    removeClass(classSingle) {
        return 0;
    }
    insertClasses(classArray) {
        return 0;
    }
    removeClasses(classArray) {
        return 0;
    }
};
var _Button = class extends HtmlElement {
    constructor(args) {
        super(args);
        this.tag = "button";
        const _args = { ...args };
        this.id = _args.id || "";
        this.text = _args.text || "";
        this.parent_form = _args.parent_form || "";
        this.classes = _args.classes || ["btn", "ihcc-primary"];
        this.type = _args.type && _Button.types.indexOf(_args.type) > 0 ? _args.type : "default";
    }
    get html() {
        if (this.type == "submit")
            this.text = "Submit";
        return `<${this.tag} id="${this.id}" form="${this.parent_form}" type="${this.type}" class="${this.classes}">${this.text}</${this.tag}>`;
    }
};
var Button = _Button;
__publicField(Button, "types", ["default", "submit", "back", "cancel"]);
var _FormInput = class extends HtmlElement {
    constructor(args) {
        super(args);
        const _args = { ...args };
        this.tag = _args.tag || "input";
        this.key = _args.key || "";
        this.id = _args.id || `${this.id}_${this.key}`;
        this.value = _args.value || "";
        this.label = _args.label || "";
        this.type = _args.type || "text";
        this.placeholder = _args.placeholder || "";
        this.required = _args.required ? " required" : "";
    }
    get fieldHtml() {
        const htmlResponse = {
            "select": () => {
                const key = this.key || "";
                const id = this.id || `${this.id}_${key}`;
                const label = this.label || "";
                const required = this.required ? " required" : "";
                const options = field.options || [];
                let content = `<label class="border-0" id="${id}_label">${label}</label>
                      <select id="${id}_${key}" name="${key}" class="form-control border" style="cursor:auto;box-sizing:border-box;height:40.5px" type="select"${required}>`;
                for (const { key: key2, value } of options) {
                    const isActive = key2 == placeholder ? " active" : "";
                    content += `<option value="${key2}"${isActive}>${value}</option>`;
                }
                content += `</select>`;
                return Form.field_wrapper({ id, content });
            },
            "input": () => {
                const key = this.key || "";
                const id = this.id || `${this.id}_${key}`;
                const value = this.value || "";
                const input_type = this.type || "text";
                const label = this.label || "";
                const placeholder2 = this.placeholder || "";
                const required = this.required ? " required" : "";
                const content = `
            <label class="border-0" id="${id}_label">
              ${label}
            </label>
            <input id="${id}_field" name="${key}" value="${value}" placeholder="${placeholder2}" class="page_form_displayName form-control border" style="cursor:auto;box-sizing:border-box;height:40.5px" type="${input_type}"${required}>
          `;
                return Form.field_wrapper({ id, content });
            },
            "textarea": () => {
                const key = this.key || "";
                const id = this.id || `${this.id}_${key}`;
                const value = this.value || "";
                const label = this.label || "";
                const placeholder2 = this.placeholder || "";
                const required = this.required ? " required" : "";
                const content = `
            <label class="border-0" id="${id}_label">${label}</label>
            <textarea style="min-height:7.55rem;" rows="4" id="${id}_field" name="${key}" placeholder="${placeholder2}" class="form-control border"${required}>${value}</textarea>`;
                return Form.field_wrapper({ id, content });
            }
        };
        return htmlResponse[this.tag]();
    }
    get html() {
        return this.fieldHtml;
    }
};
var FormInput = _FormInput;
__publicField(FormInput, "field_types", ["select", "input", "textarea"]);
__publicField(FormInput, "getHtmlFromArgs", (field2) => {
    const response2 = new _FormInput({ ...field2 });
    return response2;
});
var Form = class extends HtmlElement {
    constructor(args) {
        super(args);
        const _args = { ...args };
        this.id = _args.id || "page_form";
        this.form_html = "";
        this.field_length = _args.fields ? _args.fields.length : 0;
        this.method = _args.method || "GET";
        this.action = _args.action || "#";
        this.fields = _args.fields || [];
    }
    set action(action) {
        return this._action = action;
    }
    get action() {
        return this._action;
    }
    push = (field2) => {
        return this.fields.push(field2);
    };
    get html() {
        let form_html = `<form id="${this.id}" class="mx-auto col-lg-9 col-md-11" action="${this.action}" method="${this.method}">`;
        form_html += `<div class="row">`;
        for (const each of this.fields) {
            form_html += `<div class="mx-auto col-lg-6 col-12">${FormInput.getHtmlFromArgs({ ...each }).html}</div>`;
        }
        form_html += '</div><div class="row"><div class="col my-3">';
        const submitButton = new Button({ id: `${this.id}_submit`, parent_form: this.id, type: "submit" });
        form_html += submitButton.html + "</div></div></form>";
        this.form_html = form_html;
        return this.form_html;
    }
};
__publicField(Form, "field_wrapper", (args) => {
    const _args = { ...args };
    const id = _args.id || "page_form";
    const content = _args.content || "";
    return `<div class="mb-3" id="${id}">${content}</div>`;
});
function generatePageCode(args) {
    const _args = { ...args };
    const title2 = _args.title || "Home";
    const content = _args.content || "No content to display...";
    const text_center = _args.text_center ? "text-center" : "text-start";
    const size = _args.size || {
        external: _args.size_ext || "col-lg-6 col-11",
        internal: _args.size_int || "col-11"
    };
    const pageTypes = {
        "basic": `<div class="container my-5 py-3 ihcc-light-grey shadow-lg ihcc-left-bar ${size.external}">
        <div>
          <div class="row">
            <div class="mx-auto">
              <div class="my-3 mx-auto ${size.internal}">
                <div class="fs-3 ${text_center}">${title2}</div>
              </div>
              <hr>
              <div class="my-3 mx-auto ${size.internal}">
                <div class="${text_center}">${content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `,
        "default": `<div class="container my-5 py-3 ihcc-light-grey shadow-lg ihcc-left-bar ${size.external}">
        <div>
          <div class="row">
            <div class="mx-auto">
              <div class="my-3 mx-auto ${size.internal}">
                <div class="${text_center}">${content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    };
    const type = _args.type && Object.keys(pageTypes).includes(_args.type) ? _args.type : "default";
    return pageTypes[type];
}
function generateNavbar(args) {
    const generateDropdown = (args2) => {
        const _args2 = { ...args2 };
        const text = _args2.text || "";
        const links = _args2.links || [];
        let responseHtml = `
      <li class="nav-item dropdown">
        <a id="navbar_dropdown_item" class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">${text}</a>
        <ul class="dropdown-menu border shadow-lg">`;
        for (const each of links)
            if (each.text == "hr")
                responseHtml += `<hr style="color:#533; margin:0; padding:0;">`;
            else
                responseHtml += `<li><a class="dropdown-item" target="${each.target || "_self"}" href="${each.link || "#"}">${each.text || ""}</a></li>`;
        return responseHtml + `</ul>
            </li>`;
    };
    const _args = { ...args };
    const brand = _args.brand || "Bootstrap 5 Seed";
    const dropdowns = _args.nav || [{}];
    let dropDownHtml = "";
    for (const each of dropdowns)
        dropDownHtml += generateDropdown(each);
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
    `;
}
function generateHeadCode(args) {
    const _args = { ...args };
    const title2 = _args.title || "Home";
    const favicon_link = _args.favicon || "https://indianhills.edu/favicon.ico";
    return `
<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf8" />
  <title>${title2}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="${favicon_link}">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://parking.indianhills.edu/stylesheets/ihcc.css">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"><\/script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"><\/script>
  <script src="/js/jQuery.dirty.js"><\/script>
  <script src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.13.4/b-2.3.6/b-html5-2.3.6/b-print-2.3.6/datatables.min.js"><\/script>
  <script src="https://kit.fontawesome.com/5496aaa581.js" crossorigin="anonymous"><\/script>
<head>
<body>
  <div id='mainBody'>
        `;
}
function generateFootcode(args) {
    const _args = { ...args };
    const type = _args.type || "full";
    const copyright = _args.copyright ? `<span id="footerText">${(/* @__PURE__ */ new Date()).getFullYear()} \xA9 ${_args.copyright}</span>` : "Default Worker Seed";
    const motto = `
      <div class="mx-auto">
        <div id="footer_motto" class="mx-auto ihcc-left-bar p-3 shadow-lg ihcc-sand bg-gradient text-center panel rounded-0" style="width:15%; min-width:10rem; margin-bottom:7.5rem;">
          <i>Life. Changing.</i>
        </div>
      </div>
    </div>`;
    const footer = `
      <footer id="mainFooter" class="mx-auto shadow-lg p-2 text-center ihcc-light-grey bg-gradient sticky-footer">
        ${copyright}
      </footer>	
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"><\/script>
      </body>
    </html>`;
    let response2 = footer;
    if (type == "full")
        response2 = motto + response2;
    return response2;
}
function generateFullPage(args) {
    const _args = { ...args };
    const title2 = _args.title || {};
    const navbar = _args.navbar || {};
    const pageCode = _args.pageCode || {};
    const copyright = _args.copyright || {};
    const responseHtml = generateHeadCode({ title: title2 }) + generateNavbar(navbar) + generatePageCode(pageCode) + generateFootcode({ copyright });
    return responseHtml;
}

// src/worker.js
var site_meta = {
    title: "WT Portal",
    url: "wt-portal.indianhills.edu",
    copyright: "Indian Hills Community College",
    navbar: {
        brand: "Warrior Tech Portal",
        nav: [{
            text: "Entra / Azure AD",
            links: [{
                text: "Password Reset (self-service)",
                link: "/reset-password",
                target: "_blank"
            }, {
                text: "Password Reset",
                link: "/azure/reset-password"
            }, { text: "hr" }, {
                text: "Account Unlock",
                link: "/azure/unlock"
            }, { text: "hr" }, {
                text: "Require MFA Reregister",
                link: "#"
            }]
        }, {
            text: "My Account",
            links: [{
                text: "Profile",
                link: "/users/me"
            }]
        }]
    }
};
var src_default = {
    async fetch(request, env, ctx) {
        const url = request.url;
        const { host, protocol, pathname } = new URL(request.url);
        const BadRequestException = (reason) => {
            this.status = 400;
            this.statusText = "Bad Request";
            this.reason = reason;
        };
        if ("https:" !== protocol || "https" !== request.headers.get("x-forwarded-proto")) {
            throw new BadRequestException("Please use a HTTPS connection.");
        }
        switch (pathname) {
            case "/": {
                const page_title = "Home";
                const responseHtml = generateFullPage({
                    ...site_meta,
                    title: `${site_meta.title} | ${page_title}`,
                    pageCode: {
                        title: page_title,
                        text_center: true,
                        content: `<span class='fs-3'>${site_meta.title}</span> <hr> Welcome to the new admin portal. At the moment it's a work in progrss, but in time you'll be able to perform administraion actions using Graph API endpoints and authenticated access.`
                    }
                });
                return rawHtmlResponse(responseHtml);
            }
            case "/azure/reset-password": {
                const page_title = "Reset Password";
                const reset_password_form = new Form({
                    id: "resetPassword",
                    fields: [
                        {
                            tag: "input",
                            key: "user_principal",
                            type: "mail",
                            value: getParameterByName(request.url, "user_principal"),
                            label: "E-mail",
                            placeholder: "E-mail",
                            required: true
                        },
                        {
                            tag: "input",
                            key: "test2",
                            value: getParameterByName(request.url, "test2"),
                            type: "password",
                            label: "New Password",
                            placeholder: "New Password",
                            required: true
                        },
                        {
                            tag: "input",
                            key: "test3",
                            type: "password",
                            value: getParameterByName(request.url, "test3"),
                            label: "Confirm New Password",
                            placeholder: "Password Confirmation",
                            required: true
                        },
                        {
                            tag: "textarea",
                            key: "explanation",
                            type: "text",
                            value: getParameterByName(request.url, "explanation"),
                            label: "Reason (required)",
                            placeholder: "Explanation...",
                            required: true
                        }
                    ]
                });
                const responseHtml = generateFullPage({
                    ...site_meta,
                    title: `${site_meta.title} | ${page_title}`,
                    pageCode: {
                        title: page_title,
                        text_center: true,
                        content: `<span class='fs-3'>${page_title}</span> <hr> Use this form to reset a user's password. <hr>` + reset_password_form.html
                    }
                });
                return rawHtmlResponse(responseHtml);
            }
            case "/request-catcher": {
                const page_title = "Request Catcher";
                const reset_password_form = new Form({
                    id: "requestCatcher",
                    action: "https://harper.requestcatcher.com/",
                    method: "POST",
                    fields: [
                        {
                            tag: "input",
                            key: "user_principal",
                            type: "mail",
                            value: getParameterByName(request.url, "user_principal"),
                            label: "E-mail",
                            placeholder: "E-mail",
                            required: true
                        },
                        {
                            tag: "input",
                            key: "password",
                            type: "password",
                            value: getParameterByName(request.url, "password"),
                            label: "New Password",
                            placeholder: "New Password",
                            required: true
                        },
                        {
                            tag: "input",
                            key: "passwordConfirmation",
                            type: "password",
                            value: getParameterByName(request.url, "passwordConfirmation"),
                            label: "Confirm New Password",
                            placeholder: "Password Confirmation",
                            required: true
                        },
                        {
                            tag: "textarea",
                            key: "explanation",
                            type: "text",
                            value: getParameterByName(request.url, "explanation"),
                            label: "Reason (required)",
                            placeholder: "Explanation...",
                            required: true
                        }
                    ]
                });
                const responseHtml = generateFullPage({
                    ...site_meta,
                    title: `${site_meta.title} | ${page_title}`,
                    pageCode: {
                        title: page_title,
                        text_center: true,
                        content: `<span class='fs-3'>${page_title}</span> <hr> This form/page to test out new APIs! <hr>` + reset_password_form.html
                    }
                });
                return rawHtmlResponse(responseHtml);
            }
            case "/azure/unlock": {
                const page_title = "Unlock Account";
                const reset_password_form = new Form({
                    id: "unlockForm",
                    fields: [{
                        tag: "input",
                        key: "email",
                        value: getParameterByName(request.url, "email"),
                        label: "E-mail",
                        placeholder: "E-mail",
                        required: true
                    }]
                });
                const responseHtml = generateFullPage({
                    ...site_meta,
                    title: `${site_meta.title} | ${page_title}`,
                    pageCode: {
                        title: page_title,
                        text_center: true,
                        content: `<span class='fs-3'>${page_title}</span> <hr> Use this form to unlock a user's account. <hr>` + reset_password_form.html
                    }
                });
                return rawHtmlResponse(responseHtml);
            }
            case "/reset-password": {
                return Response.redirect("https://account.live.com/ResetPassword.aspx", 301);
            }
            default: {
                const page_title = "404";
                const responseHtml = generateFullPage({
                    ...site_meta,
                    title: `${site_meta.title} | ${page_title}`,
                    pageCode: {
                        title: page_title,
                        content: `<span class="fs-3">${page_title}</span> <hr> PAGE NOT FOUND! Head <a href="/">home</a> to try and find what you're looking for.<br><br>If you believe this is in error, contact the IT Helpdesk at helpdesk@indianhills.edu.`
                    }
                });
                return rawHtmlResponse(responseHtml);
            }
        }
    }
};
export {
    src_default as default
};
//# sourceMappingURL=worker.js.map
