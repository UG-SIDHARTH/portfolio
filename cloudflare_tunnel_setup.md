# Cloudflare Tunnel Deployment Guide (Debian Server)

Since you are using a **Cloudflare Tunnel (`cloudflared`)** on your Debian server, you do not need Nginx or Let's Encrypt Certbot. Cloudflare Tunnel handles all SSL/TLS handshakes, edge-caching, and firewalls natively.

Here are the deployment pathways utilizing your existing **Tunnel ID**.

---

## Method A: Cloudflare Zero Trust Dashboard (Easiest)
If you manage your tunnel through the Cloudflare Zero Trust web dashboard, you do not need to edit local server configuration files:

1. Log in to the [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2. Navigate to **Networks** -> **Tunnels** in the sidebar.
3. Click on your active tunnel and select **Edit**.
4. Switch to the **Public Hostname** tab.
5. Click **Add a public hostname** and set:
   - **Subdomain:** (Leave blank for root apex domain)
   - **Domain:** `ugsidharth.in` (Select your custom domain)
   - **Path:** (Leave blank)
   - **Type:** `HTTP`
   - **URL:** `localhost:3500` (This targets your portfolio backend)
6. Click **Save hostname**. Cloudflare will automatically route your root domain and provision active SSL certificates immediately.

---

## Method B: Local CLI Config File (`config.yml`)
If your tunnel runs via a local configuration file on your Debian server:

1. Open your `config.yml` (typically located in `/etc/cloudflared/config.yml` or `~/.cloudflared/config.yml`):
   ```bash
   sudo nano /etc/cloudflared/config.yml
   ```
2. Update the `ingress` rules section to point your root domain to the portfolio backend service:
   ```yaml
   tunnel: YOUR_TUNNEL_UUID
   credentials-file: /etc/cloudflared/YOUR_TUNNEL_UUID.json

   ingress:
     # Route root apex domain to portfolio Node.js process
     - hostname: ugsidharth.in
       service: http://localhost:3500

     # Route www subdomain to portfolio Node.js process
     - hostname: www.ugsidharth.in
       service: http://localhost:3500

     # Catch-all rule (required at the end of ingress blocks)
     - service: http_status:404
   ```
3. Test your tunnel config integrity:
   ```bash
   cloudflared tunnel ingress validate
   ```
4. Restart your systemd cloudflared daemon on Debian:
   ```bash
   sudo systemctl restart cloudflared
   ```

---

## Method C: Docker Compose Integration (Token Based)
If you prefer running both the portfolio server and the cloudflared connector side-by-side inside Docker containers, update your [docker-compose.yml](file:///c:/Users/Lenovo/Downloads/porfolio/portfolio/docker-compose.yml):

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    container_name: sidharth-portfolio
    restart: always
    ports:
      - "3500:3500"
    volumes:
      - ./messages.json:/usr/src/app/messages.json
    environment:
      - PORT=3500
      - NODE_ENV=production

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    restart: always
    command: tunnel --no-autoupdate run
    environment:
      # Retrieve this token from Zero Trust Dashboard -> Tunnels -> Edit -> Install Guide
      - TUNNEL_TOKEN=YOUR_CLOUDFLARE_TUNNEL_TOKEN
    depends_on:
      - portfolio
```
Run `docker compose up -d` to spin up both services. The local network will route internal container traffic without exposing port 3000 to the public web.
