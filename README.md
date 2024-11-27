# Cloudflare Starter Worker

A simple starter project for creating, developing, and deploying Cloudflare Workers. This guide walks you through setting up a Cloudflare Worker using the Cloudflare CLI (`wrangler`), running it locally, and deploying it to Cloudflare's edge.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- **Wrangler** (Cloudflare's CLI tool)

### Install Wrangler
```bash
npm install -g wrangler
```

## Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/cloudflare-starter-worker.git
   cd cloudflare-starter-worker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Authenticate with Cloudflare:**
   ```bash
   wrangler login
   ```

   This opens a browser window for you to authenticate and link Wrangler to your Cloudflare account.

## Local Development

1. **Start the local development server:**
   ```bash
   wrangler dev
   ```

2. **Access the Worker locally:**
   Your Worker will be available at `http://127.0.0.1:8787`.

   Changes you make to the code will automatically reflect after refreshing the page.

## Deploying to Cloudflare

1. **Publish your Worker:**
   ```bash
   wrangler publish
   ```

2. **Verify the deployment:**
   After deployment, Wrangler will provide a URL (typically `https://<worker-name>.<your-cloudflare-subdomain>.workers.dev`).

## Project Structure

- **`src/index.js`**: The main entry point for your Worker.
- **`wrangler.toml`**: Configuration file for Wrangler.
- **`package.json`**: Project dependencies and scripts.

## Customization

- Update `wrangler.toml` with your specific settings, such as environment variables and account details.
- Extend functionality by adding routes and handling requests in `src/index.js`.

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Guide](https://developers.cloudflare.com/workers/wrangler/)
