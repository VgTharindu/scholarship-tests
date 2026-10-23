export const MONTHS=['ජනවාරි','පෙබරවාරි','මාර්තු','අප්‍රේල්','මැයි','ජූනි','ජූලි','අගෝස්තු','සැප්තැම්බර්','ඔක්තෝබර්','නොවැම්බර්','දෙසැම්බර්']
const p=n=>String(n).padStart(2,'0')
export const dt=x=>{const d=new Date(x),h=d.getHours();return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()}, ${h%12||12}:${p(d.getMinutes())} ${h<12?'පෙ.ව.':'ප.ව.'}`}
export const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+p(s%60)}
export const fmtH=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600);return (h?h+':':'')+p(Math.floor(s%3600/60))+':'+p(s%60)}
export const fmtT=s=>Math.floor(s/60)+'මි '+Math.round(s%60)+'තත්'
export const score=(a,qs)=>qs.filter(q=>q.test_id===a.test_id&&a.answers?.[q.id]?.a===q.correct).reduce((s,q)=>s+q.marks,0)
export async function compress(file,max=800){
  const bm=await createImageBitmap(file),r=Math.min(1,max/Math.max(bm.width,bm.height))
  const c=document.createElement('canvas');c.width=Math.round(bm.width*r);c.height=Math.round(bm.height*r)
  c.getContext('2d').drawImage(bm,0,0,c.width,c.height)
  return new Promise(res=>c.toBlob(b=>res(b),'image/jpeg',0.7))
}