# SalesFlow - B2B Sales Management Platform

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev
# Opens at http://localhost:5173

# 3. Build for production
npm run build
# Creates /dist folder
```

## Deploy to Netlify

### Option A — Drag & Drop (Fastest)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist/` folder onto the Netlify dashboard
4. Your app is live!

### Option B — GitHub Auto-Deploy
1. Push this folder to GitHub
2. Go to Netlify → "Add new site" → "Import from GitHub"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy

## Demo Login
- Email: `kavi@demotech.in`
- Password: `password123`

## Project Structure
```
salesflow/
├── index.html          # Entry HTML
├── vite.config.js      # Vite config
├── package.json        # Dependencies
├── netlify.toml        # Netlify deploy config
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Full app (all modules)
```

## Modules
- Dashboard — KPIs, revenue chart, pipeline chart
- Leads — Add, search, delete leads
- Pipeline — Drag & drop Kanban board
- Customers — Company accounts
- Products — Product catalog
- Quotations — Quote builder with line items
- Invoices — Invoice tracking & payment status
- Settings — Company profile, team, plan
