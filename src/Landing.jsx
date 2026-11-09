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

const FOR_STUDENT = [
  "ගිණුමක් නැතිව නම සහ පන්තිය තෝරා ඇතුළු වන්න",
  "ඊළඟ පරීක්ෂණය ආරම්භ වීමට ඇති කාලය බලාගන්න",
  "පින්තූර සහිත ප්‍රශ්න, ප්‍රශ්නයකට නියමිත කාලයක් සමඟ",
  "නිවැරදි පිළිතුරු, ලකුණු සහ පන්තියේ ස්ථානය බලන්න",
  "පසුගිය පරීක්ෂණවල ප්‍රතිඵල නැවත බලන්න",
];

const FOR_SIR = [
  "දිනය සහ වෙලාව දී පරීක්ෂණ කලින්ම සකස් කරන්න",
  "ප්‍රශ්නයකට ලකුණු, කාල සීමාව සහ පින්තූර එකතු කරන්න",
  "ප්‍රතිඵල ලැයිස්තුව Excel ලෙස ලබාගන්න",
  "එක් එක් ප්‍රශ්නයට නිවැරදිව පිළිතුරු දුන් ප්‍රතිශතය බලන්න",
  "මාසයේ සාමාන්‍ය ලකුණු අනුව ළමුන්ගේ ලැයිස්තුව ගන්න",
];

const STEPS = [
  ["නම ලියා පන්තිය තෝරන්න", "ඔබේ සම්පූර්ණ නම ලියා 5 වසර තෝරන්න."],
  ["පරීක්ෂණය ආරම්භ කරන්න", "පරීක්ෂණය \"දැන් පවතී\" ලෙස පෙන්වූ විට ආරම්භ කරන්න."],
  ["ප්‍රතිඵල බලන්න", "ඉදිරිපත් කළ පසු ලකුණු සහ ඔබේ ස්ථානය බලන්න."],
];

export default function Landing({ onStudent, onTeacher }) {
  return (
    <div className="qm">
      <header className="qm-top">
        <button className="qm-link" onClick={onTeacher}>
          සර් පිවිසුම
        </button>
      </header>

      <section className="qm-hero">
        <div className="qm-hero-text">
          <Logo size={88} />
          <h1>QUIZ MASTER 5</h1>
          <p className="qm-tag">Grade 5 Scholarship Learning Platform</p>
          <p className="qm-lead">
            චාමර සර්ගේ 5 වසර ශිෂ්‍යත්ව පන්තියේ ළමුන් සඳහා online අභ්‍යාස
            පරීක්ෂණ. නියමිත වෙලාවට පරීක්ෂණය කර, ලකුණු සහ පන්තියේ ස්ථානය එවෙලේම
            බලන්න.
          </p>
          <div className="qm-cta">
            <button className="qm-main" onClick={onStudent}>
              පරීක්ෂණයට යන්න
            </button>
            <button className="qm-ghost" onClick={onTeacher}>
              මම චාමර සර්
            </button>
          </div>
        </div>
        <Sample onStudent={onStudent} />
      </section>

      <section className="qm-lists">
        <Checklist title="ළමුන්ට" items={FOR_STUDENT} />
        <Checklist title="චාමර සර්ට" items={FOR_SIR} />
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

      <section className="qm-sir">
        <div className="qm-sir-mark" aria-hidden="true">
          චා
        </div>
        <div>
          <h2>චාමර සර්</h2>
          <p>
            මෙහි ඇති සියලු පරීක්ෂණ සකස් කරන්නේ චාමර සර් විසින්. පරීක්ෂණ
            වෙලාවන් ගැන දැනගන්න පන්තියේදී සර්ගෙන් අහන්න.
          </p>
        </div>
      </section>

      <footer className="qm-foot">
        <span>© {new Date().getFullYear()} QUIZ MASTER 5</span>
        <span>චාමර සර්ගේ 5 වසර ශිෂ්‍යත්ව පන්තිය</span>
      </footer>
    </div>
  );
}

// උත්තර පත්‍රයක් වගේ පෙනෙන, ඇත්තටම උත්තර දිය හැකි නියැදි ප්‍රශ්නය
function Sample({ onStudent }) {
  const [pick, setPick] = useState(null);
  const done = pick === SAMPLE.correct;
  return (
    <div className="qm-paper">
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
            <b className="qm-tick">✓</b> හරි! {SAMPLE.why}
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

function Checklist({ title, items }) {
  return (
    <div className="qm-list">
      <h2>{title}</h2>
      <ul>
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
