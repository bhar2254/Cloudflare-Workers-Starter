/**
 * std.ts
 * Module for creating general applications with Cloudflare Workers
 */

// Generate a random number in range
export function getRandomInRange(min, max) {
  const randomBuffer = new Uint32Array(1)
  crypto.getRandomValues(randomBuffer)

  let randomNumber = randomBuffer[0] / (0xffffffff + 1)

  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(randomNumber * (max - min + 1)) + min
}

//  Get a parameter's value by key
export function getParameterByName(url, name) {
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

// Generate a webpage using raw HTML
export function rawHtmlResponse(html) {
  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }
  });
}