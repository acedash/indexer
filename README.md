# 🚀 Rocket Indexer SaaS | Production Engine

Rocket Indexer is a high-performance indexing platform designed to force Googlebot discovery and ensure rapid indexing through a multi-channel signal architecture.

## ✨ Key Features
- **4-Channel Signal Blasting**: Google Indexing API, Prioritized Sitemaps, RSS Discovery, and a Magnetic Crawl Hub link network.
- **Multi-Project Management**: Manage multiple sites with dedicated API keys and individual Google Service Accounts.
- **Premium Dashboard**: Glassmorphism UI with real-time activity feeds, live stats, and indexing status verification.
- **Admin Security**: Simple, robust password protection for indexing controls.
- **Production Ready**: Full TypeScript support, Prisma driver adapters for cloud databases, and BullMQ background processing.

## 🚀 Quick Start (Local)
1. **Configure Environment**:
   - Rename `.env.example` to `.env`.
   - Set `DATABASE_URL`, `REDIS_URL`, and `DOMAIN`.
   - Set `ADMIN_PASSWORD` (default: `admin123`).
   - Add `SERPER_API_KEY` for live indexing verification.

2. **Install & Run**:
   ```bash
   npm install
   npm run generate
   npm run dev
   ```

3. **Access Dashboard**:
   - Visit `http://localhost:3000`
   - Enter your `ADMIN_PASSWORD`.

## ☁️ Deployment (Render/Vercel)
1. **Environment Variables**: Ensure all `.env` variables are set in your provider's dashboard.
2. **Build Command**: `npm run generate && npm run build`
3. **Start Command**: `npm start`
4. **Prisma**: The project uses `@prisma/adapter-pg` to ensure database stability in managed environments.

## 📡 API Usage
Submit URLs programmatically:
```bash
curl -X POST https://yourdomain.com/submit \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PROJECT_API_KEY" \
  -d '{"urls": ["https://example.com/page-1"]}'
```

---
Built for high-speed discovery. 🏁
