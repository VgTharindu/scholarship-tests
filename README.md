# 📝 ශිෂ්‍යත්ව අභ්‍යාස පරීක්ෂණ පද්ධතිය

3, 4, 5 වසර ශිෂ්‍යත්ව පන්තිවල ළමයින් සඳහා සකස් කළ online MCQ පරීක්ෂණ පද්ධතියකි. සර්ට පරීක්ෂණ schedule කරන්න, ප්‍රශ්න එකතු කරන්න, ප්‍රතිඵල සහ විශ්ලේෂණ බලන්න පුළුවන්. ළමයින්ට නියමිත වෙලාවට පරීක්ෂණයට සහභාගී වී ප්‍රතිඵල බලන්න පුළුවන්.

## ✨ විශේෂාංග

### ළමයා
- ගිණුමක් නැතිව නම සහ පන්තිය (3/4/5 වසර) තෝරා ඇතුල් වීම
- ඉදිරි පරීක්ෂණ ළඟම එක උඩින් පෙනෙනවා, ආරම්භ වීමට ඉතිරි කාලය පෙන්වනවා
- පරීක්ෂණය "දැන් පවතී" වුණාම ආරම්භ කළ හැකියි, අවසන් වීමට ඉතිරි කාලය පෙන්වනවා
- ප්‍රශ්නයකට තත්පර සීමාවක් තිබුණොත් අවසන් වූ විට "කාලය අවසන්!" ලෙස auto ඊළඟට යනවා (පසුපසට යන්න බැහැ)
- කාල සීමාවක් නැති ප්‍රශ්න වලට ඊළඟ/පෙර බොත්තම් වලින් යා හැකියි
- ප්‍රමාද වී ආවත් අවසන් වෙලාවට පරීක්ෂණය වැසෙනවා
- ප්‍රතිඵල: ✅/❌, නිවැරදි පිළිතුර, මුළු ලකුණු, ස්ථානය (rank)
- පසුගිය පරීක්ෂණ වෙනම tab එකක

### සර් (Dashboard)
- Email/මුරපදයෙන් වෙනම login
- පරීක්ෂණ schedule කිරීම (වසර, නම, ආරම්භ/අවසන් වෙලාව)
- ප්‍රශ්න එකතු කිරීම, වෙනස් කිරීම, මැකීම (පරීක්ෂණය ආරම්භ වීමට පෙර පමණයි)
- ප්‍රශ්නයකට ලකුණු, තත්පර සීමාව, පින්තූරය (auto compress)
- ඉදිරි / අවසන් පරීක්ෂණ වෙන වෙනම, නමෙන් සහ දිනයෙන් සෙවීම
- ප්‍රතිඵල ලැයිස්තුව (ලකුණු, මුළු කාලය, ප්‍රශ්නයකට සාමාන්‍ය කාලය) සහ Excel export
- විශ්ලේෂණය: ප්‍රශ්නයකට නිවැරදි ප්‍රතිශතය, සාමාන්‍ය/ඉහළම/අඩුම ලකුණු
- මාසික සාමාන්‍ය ලකුණු ලැයිස්තුව (සිංහල මාස නම්) සහ Excel export

## 🧰 Technology (සියල්ල නොමිලේ)

| කොටස | Technology |
|---|---|
| Frontend | React + Vite |
| Database, Login, Image storage | Supabase (free plan) |
| Excel export | SheetJS (xlsx) |
| Hosting | Vercel (free) |
| Code | GitHub |

## 📁 Folder ව්‍යුහය

```
test-system/
├── index.html
├── package.json
├── vite.config.js
├── supabase.sql        ← Database setup (Supabase SQL Editor එකේ run කරන්න)
├── .env.example        ← .env ලෙස copy කර keys දාන්න
└── src/
    ├── main.jsx
    ├── App.jsx         ← මුල් පිටුව (ළමයා / සර්)
    ├── Student.jsx     ← ළමයාගේ පිටු
    ├── Teacher.jsx     ← සර්ගේ dashboard
    ├── util.js         ← සිංහල මාස, වෙලාව format, image compress
    ├── supabase.js
    └── styles.css
```

## 🚀 Setup කරන හැටි

### 1. අවශ්‍ය මෙවලම්
- [Node.js](https://nodejs.org) (LTS version)
- [VS Code](https://code.visualstudio.com)

### 2. Supabase
1. [supabase.com](https://supabase.com) හි project එකක් සාදන්න (Region: Singapore).
2. **SQL Editor → New query** එකේ `supabase.sql` file එකේ සියල්ල paste කර **Run** කරන්න.
3. පසුගිය පරීක්ෂණ දවස් 60ක් දක්වා ළමයාට පෙන්වීමට මේ SQL එකත් run කරන්න:
   ```sql
   create or replace function list_tests(g int) returns table(id uuid,name text,start_at timestamptz,end_at timestamptz,now_ts timestamptz)
   language sql security definer as $$ select id,name,start_at,end_at,now() from tests where grade=g and end_at>now()-interval '60 days' order by start_at $$;
   ```
4. **Authentication → Users → Add user → Create new user**: සර්ගේ email සහ මුරපදය දාන්න, **Auto Confirm User** tick කරන්න.
5. **Project Settings → API** වෙතින් **Project URL** සහ **anon public key** copy කරගන්න.

### 3. ඔබේ computer එකේ run කිරීම
1. `.env.example` එක copy කර `.env` ලෙස නම වෙනස් කරන්න:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=ඔයාගේ-anon-key
   ```
   ⚠️ URL එක `.supabase.co` වලින් අවසන් විය යුතුයි. `/rest/v1/` වැනි කිසිවක් අගට එක් නොකරන්න.
2. Terminal එකේ:
   ```
   npm install
   npm run dev
   ```
3. Browser එකෙන් `http://localhost:5173` open කරන්න.

### 4. Host කිරීම (Vercel)
1. Code එක GitHub repository එකකට push කරන්න (`.env` file එක push නොවේ).
2. [vercel.com](https://vercel.com) හි GitHub එකෙන් login වී repository එක **Import** කරන්න.
3. **Environment Variables** වලට `VITE_SUPABASE_URL` සහ `VITE_SUPABASE_ANON_KEY` එකතු කරන්න.
4. **Deploy** ඔබන්න. ලැබෙන `xxx.vercel.app` link එක ළමයින්ට/දෙමාපියන්ට දෙන්න.

Code වෙනස් කළාම:
```
git add .
git commit -m "update"
git push
```
Vercel එක auto deploy කරනවා.

## 👨‍🏫 සර් පාවිච්චි කරන හැටි

1. Link එක open කර **සර්** බොත්තම ඔබා email/මුරපදයෙන් login වන්න.
2. **ඉදිරි පරීක්ෂණ → ➕ නව පරීක්ෂණයක්** වලින් වසර, නම, ආරම්භ/අවසන් වෙලාව දී සාදන්න.
3. සෑදූ පරීක්ෂණය click කර **ප්‍රශ්න** tab එකෙන් ප්‍රශ්න එකතු කරන්න (ප්‍රශ්නය, පිළිතුරු 4, නිවැරදි පිළිතුර, ලකුණු, තත්පර, පින්තූරය).
4. පරීක්ෂණය අවසන් වූ පසු එය **අවසන් පරීක්ෂණ** tab එකට යනවා. එය click කර **ප්‍රතිඵල** සහ **විශ්ලේෂණය** බලන්න, Excel ගන්න.
5. **මාසික** tab එකෙන් මාසයක සාමාන්‍ය ලකුණු ලැයිස්තුව ගන්න.

## 🔒 ආරක්ෂාව

- නිවැරදි පිළිතුරු ළමයාගේ phone එකට යවන්නේ නැහැ. ප්‍රතිඵල ගණනය කරන්නේ server (Supabase) එකේ.
- පරීක්ෂණයේ අවසන් වෙලාව server වෙලාවෙන් පාලනය වේ.
- ප්‍රශ්න සහ ප්‍රතිඵල වෙනස් කළ හැක්කේ login වූ සර්ට පමණයි.
- `.env` file එක කිසිවිටක GitHub එකට upload නොකරන්න.

## ⚠️ දැනගත යුතු දේවල්

- එකම නම ඇති ළමයින් දෙදෙනෙකුගේ ප්‍රතිඵල එකතු වෙයි. සම්පූර්ණ නම ලියන්න කියන්න.
- ප්‍රශ්නයක තත්පර කාලය ළමයාගේ browser එකේ ක්‍රියාත්මක වේ. මුළු පරීක්ෂණයේ අවසන් වෙලාව server එකෙන් පාලනය වේ.
- Supabase free plan එකේ project එක සතියක් භාවිත නොකළොත් pause වේ. Dashboard එකෙන් **Restore** කරන්න.
- Free plan සීමා වෙනස් විය හැකි නිසා supabase.com/pricing බලන්න.

## 🛠️ ගැටලු විසඳීම

| ගැටලුව | විසඳුම |
|---|---|
| Login: `404 Not Found` | `.env` හි URL එකේ `/rest/v1/` ඉවත් කර dev server එක restart කරන්න |
| Login: `Invalid login credentials` | Supabase → Users හි user ඉන්නවාදැයි බලන්න, **Auto Confirm** tick කර නැවත සාදන්න |
| `.env` වෙනස් කළත් වෙනසක් නැත | `Ctrl + C` ඔබා `npm run dev` නැවත දාන්න |
| Vercel හි වෙනසක් නැත | Environment Variables වෙනස් කළාම **Redeploy** කරන්න |
| පින්තූරය upload නොවේ | `supabase.sql` එක සම්පූර්ණයෙන් run වූවාදැයි බලන්න (storage bucket එක එහි තියෙනවා) |
