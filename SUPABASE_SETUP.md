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
The project URL and anon/publishable key are public browser configuration. They may be included in HTML when RLS and database grants enforce access. Never put a secret or service-role key in the browser. If you prefer build-time configuration, use Netlify Environment Variables:

1. Netlify Dashboard → **Site settings** → **Environment variables**
2. Add:
   - `SUPABASE_URL` = your project URL
   - `SUPABASE_ANON_KEY` = your anon key
3. Add a build step to inject these public values into `index.html`. This static site currently has no build step, so setting hosting environment variables alone does not change its configuration.

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
- The current authenticated policies allow every signed-in user to read/update appointments; they do not check an admin role. Restrict these policies to approved staff before adding public sign-up or a patient portal.
- Keep service-role/secret keys on a trusted server only; never use them in a browser admin dashboard.

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
| Insert fails when chained with `.select('id').single()` | Anonymous users have INSERT but no SELECT policy. Use insert-only; the form now generates an optional UUID reference before inserting and includes it in WhatsApp only after a successful save. Do not add public SELECT access to patient records. |
| WhatsApp doesn't open | Popup blocked? Check browser settings; fallback uses `window.location` |

### Verified configuration (September 20, 2026)

The project dashboard was healthy, all three schema tables existed, and `appointments` was empty. Live appointment policies matched this repository: anonymous INSERT and authenticated SELECT/UPDATE, with RLS enabled. The local form's insert/read mismatch has been corrected. Deploy the updated `script.js`, then submit a clearly labelled synthetic test and verify its row in Table Editor. Local mocked checks cover save success, API rejection, network failure, and missing Supabase client. A subsequent live integration test reproduced the original 401 / 42501 RLS error and successfully saved through the corrected form handler using the actual Supabase SDK. Anonymous SELECT returned no rows, confirming the record remains private. WhatsApp was intercepted during testing; no message was sent. The synthetic record is labelled `CODEX INTEGRATION TEST - IGNORE` (ID `da12e3f4-b03d-4aae-aff5-737fa4ad955c`). The updated website files have not been deployed.

## 📞 Support
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)
