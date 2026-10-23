import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { sb } from "./supabase";
import { MONTHS, dt, fmtT, score, compress } from "./util";

const stat = (t) => {
  const n = Date.now();
  return n < new Date(t.start_at) ? 0 : n < new Date(t.end_at) ? 1 : 2;
};
const ST = ["ඉදිරියට", "දැන් පවතී", "අවසන්"],
  COL = ["#ca8a04", "#16a34a", "#64748b"];
const xl = (rows, name) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Sheet1");
  XLSX.writeFile(wb, name + ".xlsx");
};

export default function Teacher({ exit }) {
  const [u, setU] = useState(null),
    [ready, setReady] = useState(false),
    [e, setE] = useState(""),
    [p, setP] = useState("");
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setU(data.session);
      setReady(true);
    });
  }, []);
  if (!ready) return <div className="wrap">රැඳී සිටින්න…</div>;
  if (!u)
    return (
      <div className="wrap">
        <button className="w sm" onClick={exit}>
          ◀ ආපසු
        </button>
        <h1>සර්ගේ පිවිසුම</h1>
        <div className="card">
          <input
            placeholder="Email"
            value={e}
            onChange={(x) => setE(x.target.value)}
          />
          <input
            type="password"
            placeholder="මුරපදය"
            value={p}
            onChange={(x) => setP(x.target.value)}
          />
          <button
            style={{ width: "100%" }}
            onClick={async () => {
              const { data, error } = await sb.auth.signInWithPassword({
                email: e,
                password: p,
              });
              error ? alert("Email හෝ මුරපදය වැරදියි") : setU(data.session);
            }}
          >
            පිවිසෙන්න
          </button>
        </div>
      </div>
    );
  return (
    <Dash
      out={() =>
        sb.auth.signOut().then(() => {
          setU(null);
          exit();
        })
      }
    />
  );
}

function Dash({ out }) {
  const [tab, setTab] = useState(0),
    [ts, setTs] = useState([]),
    [sel, setSel] = useState(null),
    [form, setForm] = useState(false),
    [s, setS] = useState(""),
    [day, setDay] = useState("");
  const load = () =>
    sb
      .from("tests")
      .select("*")
      .then(({ data }) => setTs(data || []));
  useEffect(() => {
    load();
  }, []);
  if (sel)
    return (
      <Detail
        t={sel}
        back={() => {
          setSel(null);
          load();
        }}
      />
    );
  const ok = (t) =>
    t.name.toLowerCase().includes(s.toLowerCase()) &&
    (!day || new Date(t.start_at).toLocaleDateString("en-CA") === day);
  const up = ts
    .filter((t) => stat(t) < 2 && ok(t))
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
  const past = ts
    .filter((t) => stat(t) === 2 && ok(t))
    .sort((a, b) => new Date(b.start_at) - new Date(a.start_at));
  const Card = ({ t }) => (
    <div
      className={"card st" + stat(t)}
      style={{ cursor: "pointer" }}
      onClick={() => setSel(t)}
    >
      <b style={{ fontSize: 18 }}>{t.name}</b>{" "}
      <span className="tag" style={{ background: COL[stat(t)] }}>
        {ST[stat(t)]}
      </span>
      <br />
      {t.grade} වසර · {dt(t.start_at)}
    </div>
  );
  return (
    <div>
      <div className="bar row">
        <span>👨‍🏫 සර්ගේ Dashboard</span>
        <span onClick={out} style={{ fontSize: 14 }}>
          ඉවත් වන්න
        </span>
      </div>
      <div className="wrap">
        <div className="row tabs">
          {["ඉදිරි පරීක්ෂණ", "අවසන් පරීක්ෂණ", "මාසික"].map((t, i) => (
            <button
              key={i}
              className={tab === i ? "on" : ""}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>
        {tab < 2 && (
          <>
            <div className="row">
              <input
                placeholder="🔍 නමෙන් සොයන්න"
                value={s}
                onChange={(e) => setS(e.target.value)}
              />
              <input
                type="date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </div>
          </>
        )}
        {tab === 0 && (
          <>
            <button
              className={form ? "w" : ""}
              style={{ width: "100%" }}
              onClick={() => setForm(!form)}
            >
              {form ? "✖ වසන්න" : "➕ නව පරීක්ෂණයක් schedule කරන්න"}
            </button>
            {form && (
              <NewTest
                done={() => {
                  setForm(false);
                  load();
                }}
              />
            )}
            {!up.length && <p>ඉදිරි පරීක්ෂණ නැත.</p>}
            {up.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </>
        )}
        {tab === 1 && (
          <>
            {!past.length && <p>අවසන් පරීක්ෂණ නැත.</p>}
            {past.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </>
        )}
        {tab === 2 && <Monthly />}
      </div>
    </div>
  );
}

function NewTest({ done }) {
  const [f, setF] = useState({ grade: 5, name: "", start: "", end: "" });
  async function create() {
    if (!f.name || !f.start || !f.end) return alert("සියල්ල පුරවන්න");
    if (new Date(f.end) <= new Date(f.start))
      return alert("අවසන් වෙලාව ආරම්භයට පසුව විය යුතුයි");
    const { error } = await sb
      .from("tests")
      .insert({
        grade: f.grade,
        name: f.name,
        start_at: new Date(f.start).toISOString(),
        end_at: new Date(f.end).toISOString(),
      });
    error ? alert(error.message) : done();
  }
  return (
    <div className="card">
      <select
        value={f.grade}
        onChange={(e) => setF({ ...f, grade: +e.target.value })}
      >
        {[3, 4, 5].map((g) => (
          <option key={g} value={g}>
            {g} වසර
          </option>
        ))}
      </select>
      <input
        placeholder="නම (උදා: morning test 01)"
        value={f.name}
        onChange={(e) => setF({ ...f, name: e.target.value })}
      />
      ආරම්භය
      <input
        type="datetime-local"
        value={f.start}
        onChange={(e) => setF({ ...f, start: e.target.value })}
      />
      අවසානය
      <input
        type="datetime-local"
        value={f.end}
        onChange={(e) => setF({ ...f, end: e.target.value })}
      />
      <button style={{ width: "100%" }} onClick={create}>
        සාදන්න (ඊළඟට ප්‍රශ්න එකතු කරන්න)
      </button>
    </div>
  );
}

function Detail({ t, back }) {
  const st = stat(t),
    [tab, setTab] = useState(st === 2 ? 1 : 0),
    [qs, setQs] = useState([]),
    [at, setAt] = useState([]);
  const loadQ = () =>
    sb
      .from("questions")
      .select("*")
      .eq("test_id", t.id)
      .order("pos")
      .then(({ data }) => setQs(data || []));
  const loadA = () =>
    sb
      .from("attempts")
      .select("*")
      .eq("test_id", t.id)
      .then(({ data }) => setAt(data || []));
  useEffect(() => {
    loadQ();
    loadA();
  }, []);
  const tot = qs.reduce((s, q) => s + q.marks, 0),
    end = new Date(t.end_at);
  const rows = at
    .map((r) => {
      const sec =
        ((r.finished_at
          ? new Date(r.finished_at)
          : new Date(Math.min(Date.now(), end))) -
          new Date(r.started_at)) /
        1000;
      return { නම: r.student, ලකුණු: score(r, qs), sec };
    })
    .sort((a, b) => b.ලකුණු - a.ලකුණු);
  const nq = qs.length || 1,
    sc = rows.map((r) => r.ලකුණු);
  return (
    <div>
      <div className="bar row">
        <span>{t.name}</span>
        <span style={{ fontSize: 14 }}>{t.grade} වසර</span>
      </div>
      <div className="wrap">
        <button className="w sm" onClick={back}>
          ◀ ආපසු
        </button>
        <p>
          {dt(t.start_at)} සිට {dt(t.end_at)} ·{" "}
          <span className="tag" style={{ background: COL[st] }}>
            {ST[st]}
          </span>
        </p>
        {st === 1 && (
          <div className="card warn">
            ⚠ පරීක්ෂණය දැන් පවතී. ප්‍රශ්න වෙනස් කළ නොහැක.
          </div>
        )}
        <div className="row tabs">
          {["ප්‍රශ්න", "ප්‍රතිඵල", "විශ්ලේෂණය"].map((x, i) => (
            <button
              key={i}
              className={tab === i ? "on" : ""}
              onClick={() => {
                setTab(i);
                loadA();
              }}
            >
              {x}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <>
            {st === 0 ? (
              <Editor t={t} qs={qs} reload={loadQ} />
            ) : (
              <p>
                <small>ආරම්භ වූ පසු ප්‍රශ්න වෙනස් කළ නොහැක.</small>
              </p>
            )}
            <h2>
              ප්‍රශ්න {qs.length} · මුළු ලකුණු {tot}
            </h2>
            {qs.map((q, k) => (
              <div className="card" key={q.id}>
                <b>
                  {k + 1}. {q.body}
                </b>{" "}
                {q.image_url && (
                  <img className="q" src={q.image_url} alt="" loading="lazy" />
                )}
                {q.options.map((o, j) => (
                  <div
                    key={j}
                    className={j === q.correct ? "ok" : ""}
                    style={{ padding: "2px 8px", borderRadius: 8 }}
                  >
                    {j + 1}. {o}
                  </div>
                ))}
                <small>
                  ලකුණු {q.marks} ·{" "}
                  {q.seconds ? q.seconds + " තත්පර" : "කාල සීමාවක් නැත"}
                </small>
                {st === 0 && (
                  <div className="row" style={{ marginTop: 8 }}>
                    <button
                      className="w sm"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("editq", { detail: q }),
                        );
                        window.scrollTo(0, 0);
                      }}
                    >
                      ✏ වෙනස් කරන්න
                    </button>
                    <button
                      className="r sm"
                      onClick={async () => {
                        if (confirm("මකන්නද?")) {
                          await sb.from("questions").delete().eq("id", q.id);
                          loadQ();
                        }
                      }}
                    >
                      මකන්න
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              className="r sm"
              onClick={async () => {
                if (
                  confirm("මුළු පරීක්ෂණයම (ප්‍රශ්න සහ ප්‍රතිඵල සමඟ) මකන්නද?")
                ) {
                  await sb.from("tests").delete().eq("id", t.id);
                  back();
                }
              }}
            >
              🗑 පරීක්ෂණය මකන්න
            </button>
          </>
        )}

        {tab === 1 && (
          <>
            {!rows.length ? (
              <p>තවම කිසිවෙක් සහභාගී වී නැත.</p>
            ) : (
              <>
                <button
                  className="g"
                  onClick={() =>
                    xl(
                      rows.map((r, i) => ({
                        ස්ථානය: i + 1,
                        නම: r.නම,
                        ලකුණු: r.ලකුණු,
                        "මුළු ලකුණු": tot,
                        "මුළු කාලය (තත්පර)": Math.round(r.sec),
                        "ප්‍රශ්නයකට සාමාන්‍ය (තත්පර)": Math.round(r.sec / nq),
                      })),
                      t.name,
                    )
                  }
                >
                  📥 Excel ලෙස ගන්න
                </button>
                <div style={{ overflowX: "auto", marginTop: 10 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>නම</th>
                        <th>ලකුණු</th>
                        <th>කාලය</th>
                        <th>ප්‍රශ්නයකට</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r.නම}>
                          <td>{i + 1}</td>
                          <td>{r.නම}</td>
                          <td>
                            {r.ලකුණු}/{tot}
                          </td>
                          <td>{fmtT(r.sec)}</td>
                          <td>{fmtT(r.sec / nq)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {tab === 2 && (
          <>
            {!rows.length ? (
              <p>දත්ත නැත.</p>
            ) : (
              <>
                <div className="row">
                  {[
                    ["සහභාගී", rows.length],
                    [
                      "සාමාන්‍ය",
                      (sc.reduce((a, b) => a + b, 0) / sc.length).toFixed(1),
                    ],
                    ["ඉහළම", Math.max(...sc)],
                    ["අඩුම", Math.min(...sc)],
                  ].map(([a, b]) => (
                    <div className="card stat" key={a}>
                      <b>{b}</b>
                      {a}
                    </div>
                  ))}
                </div>
                <h2>ප්‍රශ්න අනුව නිවැරදි ප්‍රතිශතය</h2>
                {qs.map((q, k) => {
                  const c = at.filter(
                      (r) => r.answers?.[q.id]?.a === q.correct,
                    ).length,
                    pc = Math.round((c * 100) / at.length);
                  return (
                    <div className="card" key={q.id}>
                      <b>
                        {k + 1}. {q.body}
                      </b>
                      <div className="pb" style={{ margin: "6px 0" }}>
                        <div
                          style={{
                            width: pc + "%",
                            background:
                              pc >= 70
                                ? "#16a34a"
                                : pc >= 40
                                  ? "#facc15"
                                  : "#dc2626",
                          }}
                        />
                      </div>
                      <small>
                        {c} / {at.length} දෙනා නිවැරදියි ({pc}%)
                      </small>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const blank = {
  body: "",
  o: ["", "", "", ""],
  c: 0,
  marks: 1,
  sec: "",
  img: null,
  url: null,
};
function Editor({ t, qs, reload }) {
  const [n, setN] = useState(blank),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const h = (e) => {
      const q = e.detail;
      setN({
        id: q.id,
        body: q.body,
        o: q.options,
        c: q.correct,
        marks: q.marks,
        sec: q.seconds || "",
        img: null,
        url: q.image_url,
      });
    };
    window.addEventListener("editq", h);
    return () => window.removeEventListener("editq", h);
  }, []);
  async function save() {
    if (!n.body || n.o.some((x) => !x))
      return alert("ප්‍රශ්නය සහ පිළිතුරු 4 ම ඕන");
    setBusy(true);
    let url = n.url;
    if (n.img) {
      const b = await compress(n.img),
        nm = Date.now() + ".jpg";
      const r = await sb.storage
        .from("qimg")
        .upload(nm, b, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (r.error) {
        setBusy(false);
        return alert(r.error.message);
      }
      url = sb.storage.from("qimg").getPublicUrl(nm).data.publicUrl;
    }
    const row = {
      body: n.body,
      image_url: url,
      options: n.o,
      correct: n.c,
      marks: +n.marks || 1,
      seconds: n.sec ? +n.sec : null,
    };
    const { error } = n.id
      ? await sb.from("questions").update(row).eq("id", n.id)
      : await sb
          .from("questions")
          .insert({
            ...row,
            test_id: t.id,
            pos: Math.max(0, ...qs.map((q) => q.pos)) + 1,
          });
    setBusy(false);
    error ? alert(error.message) : (setN(blank), reload());
  }
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>
        {n.id ? "✏ ප්‍රශ්නය වෙනස් කරන්න" : "➕ නව ප්‍රශ්නයක්"}
      </h2>
      <input
        placeholder="ප්‍රශ්නය"
        value={n.body}
        onChange={(e) => setN({ ...n, body: e.target.value })}
      />
      {n.url && (
        <div>
          <img className="q" src={n.url} alt="" style={{ maxHeight: 140 }} />
          <button className="r sm" onClick={() => setN({ ...n, url: null })}>
            පින්තූරය ඉවත් කරන්න
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setN({ ...n, img: e.target.files[0] })}
      />
      {n.o.map((o, j) => (
        <div className="row" key={j}>
          <input
            placeholder={"පිළිතුර " + (j + 1)}
            value={o}
            onChange={(e) => {
              const x = [...n.o];
              x[j] = e.target.value;
              setN({ ...n, o: x });
            }}
          />
          <button
            className={n.c === j ? "g" : "w"}
            style={{ flex: "0 0 110px" }}
            onClick={() => setN({ ...n, c: j })}
          >
            {n.c === j ? "නිවැරදි ✔" : "නිවැරදිද?"}
          </button>
        </div>
      ))}
      <div className="row">
        <input
          type="number"
          placeholder="ලකුණු"
          value={n.marks}
          onChange={(e) => setN({ ...n, marks: e.target.value })}
        />
        <input
          type="number"
          placeholder="තත්පර (හිස් නම් කාල සීමාවක් නැත)"
          value={n.sec}
          onChange={(e) => setN({ ...n, sec: e.target.value })}
        />
      </div>
      <div className="row">
        <button disabled={busy} onClick={save}>
          {busy
            ? "රැඳී සිටින්න…"
            : n.id
              ? "වෙනස්කම් සුරකින්න"
              : "ප්‍රශ්නය එකතු කරන්න"}
        </button>
        {n.id && (
          <button className="w" onClick={() => setN(blank)}>
            අවලංගු
          </button>
        )}
      </div>
    </div>
  );
}

function Monthly() {
  const now = new Date(),
    [g, setG] = useState(5),
    [y, setY] = useState(now.getFullYear()),
    [m, setM] = useState(now.getMonth()),
    [rows, setRows] = useState(null);
  async function go() {
    const a = new Date(y, m, 1),
      b = new Date(y, m + 1, 1);
    const { data: ts } = await sb
      .from("tests")
      .select("id")
      .eq("grade", g)
      .gte("start_at", a.toISOString())
      .lt("start_at", b.toISOString());
    const ids = (ts || []).map((x) => x.id);
    if (!ids.length) return setRows([]);
    const [at, q] = await Promise.all([
      sb.from("attempts").select("*").in("test_id", ids),
      sb.from("questions").select("*").in("test_id", ids),
    ]);
    const o = {};
    at.data.forEach((r) => {
      const k = r.student.toLowerCase();
      o[k] = o[k] || { නම: r.student, n: 0, s: 0 };
      o[k].n++;
      o[k].s += score(r, q.data);
    });
    setRows(
      Object.values(o)
        .map((x) => ({
          නම: x.නම,
          "සහභාගී වූ පරීක්ෂණ": x.n,
          "මුළු පරීක්ෂණ": ids.length,
          "සාමාන්‍ය ලකුණු": +(x.s / x.n).toFixed(1),
        }))
        .sort((a, b) => b["සාමාන්‍ය ලකුණු"] - a["සාමාන්‍ය ලකුණු"])
        .map((r, i) => ({ ස්ථානය: i + 1, ...r })),
    );
  }
  return (
    <div>
      <h2>මාසික සාමාන්‍යය</h2>
      <div className="row">
        <select value={g} onChange={(e) => setG(+e.target.value)}>
          {[3, 4, 5].map((x) => (
            <option key={x} value={x}>
              {x} වසර
            </option>
          ))}
        </select>
        <select value={y} onChange={(e) => setY(+e.target.value)}>
          {[
            now.getFullYear() - 1,
            now.getFullYear(),
            now.getFullYear() + 1,
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select value={m} onChange={(e) => setM(+e.target.value)}>
          {MONTHS.map((x, i) => (
            <option key={i} value={i}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <button onClick={go}>ලැයිස්තුව ගන්න</button>
      {rows &&
        (!rows.length ? (
          <p>මෙම මාසයේ පරීක්ෂණ නැත.</p>
        ) : (
          <>
            <button
              className="g"
              style={{ marginLeft: 8 }}
              onClick={() => xl(rows, `${MONTHS[m]}_${y}_${g}වසර`)}
            >
              📥 Excel
            </button>
            <div style={{ overflowX: "auto", marginTop: 10 }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>නම</th>
                    <th>පරීක්ෂණ</th>
                    <th>සාමාන්‍යය</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.නම}>
                      <td>{r.ස්ථානය}</td>
                      <td>{r.නම}</td>
                      <td>
                        {r["සහභාගී වූ පරීක්ෂණ"]}/{r["මුළු පරීක්ෂණ"]}
                      </td>
                      <td>{r["සාමාන්‍ය ලකුණු"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}
    </div>
  );
}
