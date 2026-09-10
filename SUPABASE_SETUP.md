# Supabase Setup Guide for Shree NarNarayan Children Hospital Website

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose organization → Enter project name: `shree-narnarayan-hospital`
4. Set database password (save it!)
5. Choose region closest to India (e.g., **Mumbai** or **Singapore**)
6. Click **"Create new project"** (takes ~2 minutes)

### 2. Run Database Schema
1. In Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy-paste the entire content of `supabase-schema.sql`
3. Click **Run** (Ctrl+Enter)
4. You should see "Success. No rows returned"

### 3. Get API Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon public key** (long JWT starting with `eyJ...`)

### 4. Update Website Configuration
Open `index.html` and replace these lines:
```html
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';
```
With your actual values:
```html
window.SUPABASE_URL = 'https://abcxyz.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🌐 Deploy to Netlify (Free, Recommended)

### Option A: Drag & Drop (Simplest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire project folder (`shree-narnarayan-hospital`) onto the page
3. Site deploys instantly with a random URL like `https://random-name.netlify.app`

### Option B: Git Integration (Auto-deploy on push)
1. Push your code to GitHub
2. In Netlify → **Add new site** → **Import from Git**
3. Connect GitHub → Select repo
4. Build settings: leave empty (static site)
5. Click **Deploy site**

### Option C: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

## 🔧 Environment Variables (Production)
For production, **don't hardcode keys in HTML**. Use Netlify Environment Variables:

1. Netlify Dashboard → **Site settings** → **Environment variables**
2. Add:
   - `SUPABASE_URL` = your project URL
   - `SUPABASE_ANON_KEY` = your anon key
3. Update `index.html` to use build-time injection or Netlify Functions

## ✅ Test the Integration
1. Visit your deployed site
2. Fill the appointment form
3. Submit → Should open WhatsApp AND save to database
4. Check Supabase Dashboard → **Table Editor** → `appointments` → See new row!

## 📊 View Appointments
- **Supabase Dashboard** → **Table Editor** → `appointments`
- Filter by status, date, service
- Export to CSV for records

## 🔒 Security Notes
- `anon` key is safe for client-side (browser) — it only has INSERT permission on appointments
- RLS policies prevent reading other patients' data
- For admin dashboard, create a separate service role key (keep secret!)

## 🎯 Next Steps (Optional)
- Add email notifications via Supabase Edge Functions
- Build admin dashboard (React/Next.js) to manage appointments
- Add SMS/WhatsApp API integration for automated confirmations
- Set up patient portal with Supabase Auth

## 🆘 Troubleshooting
| Issue | Solution |
|-------|----------|
| Form submits but no DB entry | Check browser console for errors; verify Supabase URL/key |
| CORS error | Supabase allows all origins by default; check URL matches exactly |
| RLS policy error | Ensure schema ran completely; check `appointments` table has RLS enabled |
| WhatsApp doesn't open | Popup blocked? Check browser settings; fallback uses `window.location` |

## 📞 Support
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)