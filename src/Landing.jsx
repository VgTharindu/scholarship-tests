import { useState } from "react";
import Logo from "./Logo";
import "./landing.css";

// Home page එකේ පෙන්වන නියැදි ප්‍රශ්නය
const SAMPLE = {
  q: "2, 5, 10, 17, ... මෙම රටාවේ ඊළඟ සංඛ්‍යාව කුමක්ද?",
  options: ["24", "26", "27", "29"],
  correct: 1,
  why: "වෙනස 3, 5, 7 ලෙස වැඩි වෙනවා. ඊළඟට 9ක් එකතු වී 26 ලැබෙනවා.",
};

// මෙම වේදිකාවෙන් ලැබෙන ප්‍රයෝජන. tone එකෙන් එක් එක් කාඩ් එකේ පාට තීරණය වෙනවා
const BENEFITS = [
  { icon: "clock", tone: "orange", text: "නියමිත කාලයට ප්‍රශ්නවලට පිළිතුරු ලබාදීමට ළමයා හුරු කරයි" },
  { icon: "star", tone: "blue", text: "පරීක්ෂණය අවසානයේ ළමයාගේ ලකුණු දැනගත හැක" },
  { icon: "trophy", tone: "green", text: "පසුගිය පරීක්ෂණවල ලකුණු සහ පන්තියේ ලබාගෙන ඇති ස්ථානය දැනගත හැක" },
  { icon: "hourglass", tone: "purple", text: "ළමයාගේ කාල කළමනාකරණය වැඩිදියුණු කරයි" },
];

const STEPS = [
  ["නම ලියා පන්තිය තෝරන්න", "ඔබේ සම්පූර්ණ නම ලියා 5 වසර තෝරන්න."],
  ["පරීක්ෂණය ආරම්භ කරන්න", "පරීක්ෂණය \"දැන් පවතී\" ලෙස පෙන්වූ විට ආරම්භ කරන්න."],
  ["ප්‍රතිඵල බලන්න", "ඉදිරිපත් කළ පසු ලකුණු සහ ඔබේ ස්ථානය බලන්න."],
];

// සර්ගේ විස්තර. අංකය වෙනස් වුණොත් මෙතන විතරක් වෙනස් කරන්න
const SIR = {
  name: "Pradeep Chamara",
  short: "චාමර සර්",
  phone: "071-7332693",
  tel: "+94717332693",
  photo: "/chamara-sir.jpg",
};

// Hero පසුබිමේ පාවෙන ගණිත සලකුණු: [සලකුණ, වමේ සිට %, උඩ සිට %, භ්‍රමණය]
const DOODLES = [
  ["+", 6, 12, -12], ["?", 88, 8, 14], ["÷", 92, 46, -8], ["✓", 4, 52, 10],
  ["★", 80, 78, 0], ["×", 14, 86, 18], ["=", 50, 4, 0],
];

export default function Landing({ onStudent, onTeacher }) {
  return (
    <div className="qm">
      <header className="qm-top">
        <div className="qm-brand">
          <Logo size={36} />
          <span>
            QUIZ MASTER <em>5</em>
          </span>
        </div>
        <button className="qm-link" onClick={onTeacher}>
          සර් පිවිසුම
        </button>
      </header>

      <section className="qm-hero">
        <div className="qm-doodles" aria-hidden="true">
          {DOODLES.map(([c, x, y, r], k) => (
            <span
              key={k}
              style={{ left: x + "%", top: y + "%", transform: `rotate(${r}deg)` }}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="qm-hero-text">
          <div className="qm-logo-blob">
            <Logo size={112} />
          </div>
          <h1>
            QUIZ MASTER <em>5</em>
          </h1>
          <p className="qm-tag">Grade 5 Scholarship Learning Platform</p>
          <button className="qm-main qm-hero-cta" onClick={onStudent}>
            පරීක්ෂණයට යන්න
          </button>
        </div>
        <Sample onStudent={onStudent} />
      </section>

      <section className="qm-block">
        <h2 className="qm-title">QUIZ MASTER 5 මගින්</h2>
        <ul className="qm-benefits">
          {BENEFITS.map((b) => (
            <li key={b.text} className={"qm-benefit " + b.tone}>
              <span className="qm-benefit-icon">
                <Icon name={b.icon} />
              </span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="qm-steps">
        <h2>පරීක්ෂණයක් කරන හැටි</h2>
        <ol>
          {STEPS.map(([t, d]) => (
            <li key={t}>
              <b>{t}</b>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="qm-block">
        <div className="qm-sir">
          <img
            src={SIR.photo}
            alt={SIR.name}
            width="160"
            height="160"
            loading="lazy"
          />
          <div className="qm-sir-text">
            <h2>{SIR.name}</h2>
            <p className="qm-sir-short">({SIR.short})</p>
            <a className="qm-call" href={"tel:" + SIR.tel}>
              <Icon name="phone" />
              <span>{SIR.phone}</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="qm-foot">
        <span>© {new Date().getFullYear()} QUIZ MASTER 5</span>
        <span>චාමර සර්ගේ 5 වසර ශිෂ්‍යත්ව පන්තිය</span>
      </footer>

      {/* Phone එකේ පමණක් පෙනෙන, පහළට ඇලී තියෙන බොත්තම */}
      <div className="qm-dock">
        <button className="qm-main" onClick={onStudent}>
          පරීක්ෂණයට යන්න
        </button>
      </div>
    </div>
  );
}

// උත්තර පත්‍රයක් වගේ පෙනෙන, ඇත්තටම උත්තර දිය හැකි නියැදි ප්‍රශ්නය
function Sample({ onStudent }) {
  const [pick, setPick] = useState(null);
  const done = pick === SAMPLE.correct;
  return (
    <div className="qm-paper">
      {/* නිවැරදි පිළිතුර දුන් විට තරු විසිරෙන animation එක */}
      {done && (
        <div className="qm-burst" aria-hidden="true">
          {Array.from({ length: 10 }, (_, k) => (
            <span key={k} style={{ "--a": k * 36 + "deg" }}>
              ★
            </span>
          ))}
        </div>
      )}
      <div className="qm-paper-head">
        <span>නියැදි ප්‍රශ්නය</span>
        <span>ලකුණු 1</span>
      </div>
      <p className="qm-q">{SAMPLE.q}</p>
      <div className="qm-bubbles" role="radiogroup" aria-label="පිළිතුරු">
        {SAMPLE.options.map((o, k) => {
          const state =
            pick === k ? (k === SAMPLE.correct ? "right" : "wrong") : "";
          return (
            <button
              key={k}
              role="radio"
              aria-checked={pick === k}
              className={"qm-bubble " + state}
              disabled={done}
              onClick={() => setPick(k)}
            >
              <i>{k + 1}</i>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      <p className="qm-feedback" aria-live="polite">
        {pick === null && "ඔබ හිතන පිළිතුරේ කවය ඔබන්න."}
        {pick !== null && !done && "එය නොවෙයි. තව එකක් උත්සාහ කරන්න."}
        {done && (
          <>
            <b className="qm-tick">✓</b> නියමයි! {SAMPLE.why}
          </>
        )}
      </p>
      {done && (
        <button className="qm-main qm-full" onClick={onStudent}>
          සැබෑ පරීක්ෂණයට යන්න
        </button>
      )}
    </div>
  );
}

// සරල SVG icons. name එක අනුව අදාළ path එක ඇඳෙනවා
function Icon({ name }) {
  const P = {
    clock: (
      <>
        <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M12 9v4l3 2M9 2h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
    star: (
      <path
        d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"
        fill="currentColor"
      />
    ),
    trophy: (
      <path
        d="M7 3h10v5a5 5 0 0 1-10 0zM7 5H3v2a4 4 0 0 0 4 4M17 5h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6v4H9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
    hourglass: (
      <path
        d="M6 2h12M6 22h12M7 2c0 5 10 6 10 10S7 17 7 22M17 2c0 5-10 6-10 10s10 5 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    ),
    phone: (
      <path
        fill="currentColor"
        d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"
      />
    ),
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      {P[name]}
    </svg>
  );
}
