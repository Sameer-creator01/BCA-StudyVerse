# StudyVerse — Android se setup (PC ke bina)

## Pehle yeh samjho
Yeh ZIP app ka source project hai, ready-made APK nahi. Isse pehli baar online build/deploy karna padega. Uske baad Android Chrome se app install ho sakta hai.

## Mobile-only deployment
1. ZIP ko phone mein download karke extract karo.
2. Vercel par account banao/sign in karo: https://vercel.com
3. Project ko GitHub repository mein upload karna hoga. GitHub mobile website par repository banao aur extracted project files upload karo. `node_modules` ya `dist` upload mat karna.
4. Vercel mein **Add New → Project** chuno aur us GitHub repository ko import karo.
5. Framework Vite detect hona chahiye. Build command `npm run build`, output directory `dist`.
6. Deploy complete hone par Vercel HTTPS URL dega. Android Chrome mein URL kholo.
7. Chrome menu → **Install app** ya **Add to Home screen**.

## AI teacher enable karna
Vercel Project → Settings → Environment Variables mein server-side variables add karo:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- Optional: `GEMINI_MODEL` (default `gemini-2.0-flash`)
- Optional: `OPENAI_MODEL` (default `gpt-4o-mini`)

Keys ko app ke code, GitHub files, ya `VITE_` variables mein mat daalna. Vercel mein variables add/update karne ke baad redeploy karo. AI tabhi chalega jab valid API key aur provider quota/billing available ho.

## Progress aur sync
Current app ka study progress browser/device storage mein hai. Is version mein complete Supabase Auth + cross-device sync wired nahi hai. Browser data clear/uninstall karne se pehle app ke backup/export feature ka use karo.

## Important
- Pehla deployment internet aur hosting account maangta hai; bina kisi hosting ke public link automatic nahi ban sakta.
- Build is package ke liye abhi independently verify nahi hua. Vercel deployment logs mein build error aaye toh exact error share karo.
- Scanned PDFs ke liye OCR chahiye; PDF text extraction sirf selectable text ke liye hai.
