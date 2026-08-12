"use client";

import { useMemo, useState } from "react";

type Portal = "patient" | "clinician";
type AnswerMap = Record<string, number | null>;

const symptomItems = [
  { id: "fatigue", label: "Fatigue", question: "What was the severity of your fatigue at its worst?", options: ["None", "Mild", "Moderate", "Severe", "Very severe"] },
  { id: "nausea", label: "Nausea", question: "What was the severity of your nausea at its worst?", options: ["None", "Mild", "Moderate", "Severe", "Very severe"] },
  { id: "pain", label: "Pain", question: "What was the severity of your pain at its worst?", options: ["None", "Mild", "Moderate", "Severe", "Very severe"] },
  { id: "breath", label: "Shortness of breath", question: "What was the severity of your shortness of breath at its worst?", options: ["None", "Mild", "Moderate", "Severe", "Very severe"] },
];

const patients = [
  { initials: "MA", name: "Maya Anderson", id: "PT-2048", regimen: "Cycle 3 · Day 8", risk: "High", score: 82, issue: "Shortness of breath", time: "18 min ago", color: "coral" },
  { initials: "JL", name: "James Liu", id: "PT-1782", regimen: "Cycle 2 · Day 15", risk: "Review", score: 58, issue: "Fatigue worsening", time: "1 hr ago", color: "amber" },
  { initials: "SR", name: "Sofia Rossi", id: "PT-2311", regimen: "Cycle 5 · Day 3", risk: "Stable", score: 24, issue: "No new concerns", time: "Today, 8:42", color: "green" },
  { initials: "DK", name: "David Kim", id: "PT-1955", regimen: "Cycle 1 · Day 10", risk: "Stable", score: 18, issue: "Mild nausea", time: "Yesterday", color: "blue" },
];

export default function Home() {
  const [portal, setPortal] = useState<Portal>("patient");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(0);
  const [careView, setCareView] = useState<"dashboard" | "patient">("dashboard");
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [toast, setToast] = useState("");

  const answered = Object.values(answers).filter((v) => v !== null && v !== undefined).length;
  const progress = submitted ? 100 : Math.round((answered / symptomItems.length) * 100);
  const current = symptomItems[step];
  const selected = patients[selectedPatient];
  const urgent = useMemo(() => Object.values(answers).some((value) => value !== null && value >= 3), [answers]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function chooseAnswer(value: number) {
    setAnswers((old) => ({ ...old, [current.id]: value }));
  }

  function resetCheckIn() {
    setAnswers({});
    setStep(0);
    setSubmitted(false);
  }

  return (
    <main className="app-shell">
      <header className={`topbar ${portal === "clinician" ? "care-mode" : ""}`}>
        <button className="brand" onClick={() => setPortal("patient")} aria-label="Digital Health UniMelb home">
          <span className="brand-mark">DH</span><span>Digital Health<span className="brand-light"> UniMelb</span></span>
        </button>
        <nav className="portal-switch" aria-label="Choose portal">
          <button className={portal === "patient" ? "active" : ""} onClick={() => setPortal("patient")}>Patient view</button>
          <button className={portal === "clinician" ? "active" : ""} onClick={() => setPortal("clinician")}>Care team</button>
        </nav>
        <div className="top-actions"><button className="icon-button" aria-label="Help">?</button><div className="avatar">MA</div></div>
      </header>

      {portal === "patient" ? (
        <section className="patient-layout">
          <aside className="patient-sidebar">
            <div>
              <p className="eyebrow">YOUR CARE PLAN</p>
              <h2>Good morning,<br />Maya.</h2>
              <p className="muted">Let’s check how you’ve been feeling over the last 7 days.</p>
            </div>
            <div className="plan-card">
              <div className="plan-date"><strong>12</strong><span>AUG</span></div>
              <div><span className="status-dot" />Check-in due today<strong>Weekly symptom check</strong></div>
            </div>
            <div className="support-card"><span className="support-icon">✦</span><div><strong>Need support now?</strong><p>Contact your care team if you are worried about a symptom.</p><button onClick={() => notify("Care team contact details opened")}>View contact details →</button></div></div>
            <p className="safety-note"><strong>Emergency?</strong> Call your local emergency number. This prototype does not provide medical advice.</p>
          </aside>

          <div className="patient-main">
            {!submitted ? (
              <div className="checkin-card">
                <div className="checkin-head">
                  <div><p className="eyebrow teal">WEEKLY CHECK-IN</p><h1>How are you feeling?</h1><p>Answer based on the <strong>last 7 days</strong>. There are no right or wrong answers.</p></div>
                  <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div>
                </div>
                <div className="step-row"><span>Question {step + 1} of {symptomItems.length}</span><span>{current.label}</span></div>
                <div className="question-panel">
                  <div className="symptom-icon">{step === 0 ? "↯" : step === 1 ? "≈" : step === 2 ? "+" : "∿"}</div>
                  <div><p className="overline">IN THE LAST 7 DAYS</p><h2>{current.question}</h2></div>
                </div>
                <div className="answer-list" role="radiogroup" aria-label={current.question}>
                  {current.options.map((option, index) => (
                    <button key={option} role="radio" aria-checked={answers[current.id] === index} className={answers[current.id] === index ? "selected" : ""} onClick={() => chooseAnswer(index)}>
                      <span className="radio-circle">{answers[current.id] === index ? "●" : ""}</span><span>{option}</span><small>{index}</small>
                    </button>
                  ))}
                </div>
                <div className="checkin-footer">
                  <button className="text-button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← Back</button>
                  {step < symptomItems.length - 1 ? <button className="primary-button" disabled={answers[current.id] === undefined} onClick={() => setStep((s) => s + 1)}>Continue →</button> : <button className="primary-button" disabled={answered < symptomItems.length} onClick={() => setSubmitted(true)}>Submit check-in</button>}
                </div>
              </div>
            ) : (
              <div className="success-card">
                <div className="success-mark">✓</div><p className="eyebrow teal">CHECK-IN COMPLETE</p><h1>Thank you, Maya.</h1><p>Your responses have been shared with your care team.</p>
                {urgent && <div className="urgent-message"><strong>Your answers need a closer look.</strong><span>Your care team has been notified. If you feel very unwell or your symptoms suddenly worsen, seek urgent medical help.</span></div>}
                <div className="summary-grid"><div><span>Completed</span><strong>Today, 9:14 AM</strong></div><div><span>Next check-in</span><strong>Tuesday, 19 Aug</strong></div></div>
                <button className="secondary-button" onClick={resetCheckIn}>Review or change answers</button>
              </div>
            )}
            <div className="privacy-line">🔒 Your health information is encrypted and shared only with your care team.</div>
          </div>
        </section>
      ) : (
        <section className="clinician-layout dh-console">
          <aside className="clinician-sidebar dh-sidebar">
            <div className="workspace-name"><div className="clinic-mark">DH</div><div><strong>Digital Health</strong></div></div>
            <p className="console-label">CONSOLE</p>
            <nav className="side-nav dh-nav"><button className={careView === "dashboard" ? "active" : ""} onClick={() => setCareView("dashboard")}>▦ Dashboard</button><button className={careView === "patient" ? "active" : ""} onClick={() => setCareView("patient")}>♙ Patients</button><button>△ Alerts</button><button>▤ Questionnaires</button><button>▱ Protocols</button><button>⌁ Reports</button><button>◷ Audit log</button><button>☼ Settings</button></nav>
            <div className="clinician-profile"><div className="avatar">MA</div><div><strong>Dr. Chen</strong><span>Surgical Oncology</span></div></div>
          </aside>
          <div className="care-workspace">
            <div className="care-top"><label><span>⌕</span><input aria-label="Search patients" placeholder="Search patients, IDs, protocols..." /></label><div className="care-top-right"><nav className="care-view-tabs" aria-label="Choose portal"><button onClick={() => setPortal("patient")}>Patient view</button><button className="active">Care team</button></nav><div className="care-top-actions"><button>♧<i /></button><div className="avatar">MA</div></div></div></div>
            {careView === "dashboard" ? <div className="care-page">
              <div className="care-grid">
                <div className="care-primary">
                  <div className="dashboard-head"><div><p className="eyebrow">TUESDAY, 12 AUGUST</p><h1>Good morning, Dr. Chen.</h1><p>Here&apos;s what needs your attention across your patient cohort.</p></div></div>
                  <div className="metric-row">
                    <div className="metric-card alert"><span>Urgent alerts</span><strong>2</strong><p>1 new since yesterday</p><i>!</i></div><div className="metric-card"><span>Check-ins due</span><strong>7</strong><p>3 completed today</p><i>◷</i></div><div className="metric-card"><span>Response rate</span><strong>91%</strong><p>Past 7 days</p><i>⌁</i></div><div className="metric-card"><span>Active patients</span><strong>24</strong><p>Across 4 protocols</p><i>♙</i></div>
                  </div>
                  <div className="cohort-card redesigned-table"><div className="card-title"><div><h2>Patient overview</h2><p>Sorted by clinical attention score</p></div><div className="filter-pills"><button className="active">All</button><button>Alerts</button><button>Due</button></div></div>
                    <div className="new-table-head"><span>PATIENT</span><span>LAST CHECK-IN</span><span>TOP SYMPTOM</span><span>TREND</span><span>STATUS</span><span /></div>
                    {patients.map((p,index)=><button className={`new-patient-row ${p.risk.toLowerCase()}`} key={p.id} onClick={()=>{setSelectedPatient(index);setCareView("patient");}}><span className="patient-cell"><i className={`mini-avatar ${p.color}`}>{p.initials}</i><span><strong>{p.name}</strong><small>{p.id} · {p.regimen}</small></span></span><span>{p.time}</span><span><strong>{p.issue}</strong><small>{p.risk === "High" ? "Severe · worsening" : p.risk === "Review" ? "Moderate · rising" : "Mild · steady"}</small></span><span className={`spark ${p.color}`}>⌁</span><span><em className={`risk ${p.risk.toLowerCase()}`}>{p.risk}</em></span><span className="view-link">View</span></button>)}
                  </div>
                </div>
                <aside className="care-rail"><section><div className="rail-title"><span>NEEDS REVIEW</span><em>2 active</em></div><div className="review-item"><strong>Maya Anderson</strong><time>40 min ago</time><p>Diarrhoea reported as <b>severe</b> — above protocol threshold.</p><button onClick={()=>notify("Calling patient")}>Call patient</button><button className="ghost" onClick={()=>{setSelectedPatient(0);setCareView("patient")}}>Open report</button></div><div className="review-item"><strong>James Liu</strong><time>Yesterday</time><p>Nausea rising for three consecutive check-ins; review suggested.</p><button className="ghost" onClick={()=>{setSelectedPatient(1);setCareView("patient")}}>Open report</button></div></section>
                  <section><div className="rail-title"><span>CHECK-INS DUE TODAY</span></div>{[["TW","Thomas Ward","10:00"],["AP","Aisha Patel","13:30"],["GC","Grace Cho","16:15"]].map(x=><div className="due-row" key={x[1]}><i>{x[0]}</i><span><strong>{x[1]}</strong><small>Weekly PRO</small></span><time>{x[2]}</time></div>)}<button className="rail-link">View all 7 due</button></section>
                  <section><div className="rail-title"><span>COHORT SYMPTOMS</span></div><p className="rail-sub">Reported at any grade, past 7 days</p>{[["Fatigue",14,78],["Nausea",9,52],["Pain (incision)",7,40],["Diarrhoea",4,24]].map(x=><div className="symptom-bar" key={x[0] as string}><span>{x[0]}<small>{x[1]} patients</small></span><i><b style={{width:`${x[2]}%`}} /></i></div>)}</section></aside>
              </div><p className="prototype-note">PRO-CTCAE data is patient-reported and not a substitute for clinical assessment.</p>
            </div> : <div className="care-page patient-detail-page">
              <button className="back-link" onClick={()=>setCareView("dashboard")}>← Patients / <strong>{selected.name}</strong></button>
              <section className="patient-hero"><div className={`large-avatar ${selected.color}`}>{selected.initials}</div><div><h1>{selected.name} <em className={`risk ${selected.risk.toLowerCase()}`}>{selected.risk}</em></h1><p>{selected.id} · 54F · Day 8 post-op · Protocol: Colorectal 12-month</p></div><div className="hero-stat"><span>ATTENTION SCORE</span><strong>{selected.score}</strong></div><div className="hero-stat"><span>LAST CHECK-IN</span><strong>2h ago</strong></div><div className="hero-stat"><span>RESPONSE RATE</span><strong>100%</strong></div><button className="primary-button" onClick={()=>notify("Patient contact opened")}>Contact patient</button></section>
              <div className="detail-dashboard"><section className="trajectory-card"><div className="card-title"><div><h2>Symptom trajectory</h2><p>PRO-CTCAE severity, post-operative days</p></div><div className="filter-pills"><button>7 days</button><button className="active">14 days</button><button>All</button></div></div><div className="trajectory-chart"><div className="expected-range"/><div className="line pain-line"/><div className="line fatigue-line"/><div className="line nausea-line"/><span className="today-dot">Today</span></div><div className="chart-legend"><span className="pain">— Pain</span><span className="fatigue">— Fatigue</span><span className="nausea">— Nausea</span><b>Pain above expected range since Day 6</b></div></section>
                <section className="flag-card"><h2>Why this patient is flagged</h2><div className="rule-box"><b>RULE</b><strong>{selected.issue} reported — Day 8</strong><p>Source: PRO-CTCAE item library + local protocol.</p></div><div className="model-box"><b>MODEL</b><strong>Deterioration risk: 0.72 <small>(elevated)</small></strong><i><span /></i><p>Model output is advisory and does not override clinical judgement.</p></div></section>
                <section className="responses-card"><div className="card-title"><div><h2>Latest responses</h2><p>PRO-CTCAE · submitted today, 08:14</p></div></div><div className="response-head"><span>SYMPTOM</span><span>FREQUENCY</span><span>SEVERITY</span><span>INTERFERENCE</span><span>CHANGE</span></div>{[["Pain (incision site)","Frequently","Severe","Quite a bit","▲ +1"],["Fatigue","Almost constantly","Moderate","Somewhat","▲ +1"],["Nausea","Occasionally","Mild","A little bit","■"],["Wound discharge","Yes — reported","—","—","▲ new"]].map(r=><div className="response-row" key={r[0]}>{r.map((v,i)=><span key={i}>{v}</span>)}</div>)}<blockquote>“The pain around the incision has been keeping me awake. This morning there was some yellowish fluid on the dressing.”</blockquote></section>
                <aside className="actions-card"><h2>Care actions</h2><button className="primary-button" onClick={()=>{setAlertAcknowledged(true);notify("Alert acknowledged")}}>{alertAcknowledged ? "Alert acknowledged" : "Acknowledge alert"}</button><button onClick={()=>notify("Review call scheduled")}>Schedule review call</button><button onClick={()=>notify("Message composer opened")}>Send patient message</button><button className="danger" onClick={()=>notify("Escalated to team")}>Escalate to team</button></aside>
              </div><p className="prototype-note">Prototype only · Signals are not CTCAE grades and must not replace clinical assessment.</p>
            </div>}
          </div>
        </section>
      )}
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
