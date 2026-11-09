import { useEffect, useState } from "react";
import Logo from "./Logo";
import "./splash.css";

// වෙබ් අඩවිය load වෙද්දී පෙන්වන තත්පර 5ක animation එක
// පියවර: "5" ඇඳෙනවා → තොප්පිය වැටෙනවා → ✓ මතුවෙනවා → නම අකුරෙන් අකුර එනවා → tagline → උඩට ගිහින් අතුරුදහන් වෙනවා
const WORD = "QUIZ MASTER";

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Animations අඩු කරන්න settings දාපු අයට කෙටි කාලයක් පමණයි
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showFor = calm ? 700 : 4500;
    const t1 = setTimeout(() => setLeaving(true), showFor); // ඉවත්වීමේ animation එක පටන් ගන්නවා
    const t2 = setTimeout(onDone, showFor + 500); // ඊට පස්සේ splash එක සම්පූර්ණයෙන්ම ඉවත් කරනවා
    document.documentElement.style.overflow = "hidden"; // splash එක තියෙද්දී පිටුව scroll වෙන්නේ නැහැ
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <div className={"qm-splash" + (leaving ? " out" : "")} role="status" aria-label="QUIZ MASTER 5 load වෙමින්">
      <div className="sp-ring">
        <Logo size={150} />
      </div>
      <h1 className="sp-name" aria-hidden="true">
        {WORD.split("").map((ch, i) => (
          <span key={i} style={{ "--i": i }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
        <em style={{ "--i": WORD.length + 1 }}>5</em>
      </h1>
      <p className="sp-tag">Grade 5 Scholarship Learning Platform</p>
      <div className="sp-bar" aria-hidden="true">
        <i />
      </div>
    </div>
  );
}
