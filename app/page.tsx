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
      <header className="topbar">
        <button className="brand" onClick={() => setPortal("patient")} aria-label="Vela Health home">
          <span className="brand-mark">V</span><span>Vela<span className="brand-light"> Health</span></span>
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
        <section className="clinician-layout">
          <aside className="clinician-sidebar">
            <div className="workspace-name"><div className="clinic-mark">VH</div><div><strong>Vela Oncology</strong><span>Clinical workspace</span></div></div>
            <nav className="side-nav"><button className="active">▦ Overview <span>2</span></button><button>♙ Patients</button><button>◫ Check-ins</button><button>⚑ Alerts <span>2</span></button><button>⌁ Analytics</button></nav>
            <div className="clinician-profile"><div className="avatar navy">EC</div><div><strong>Dr. Emily Chen</strong><span>Medical Oncology</span></div><button>•••</button></div>
          </aside>
          <div className="clinician-main">
            <div className="dashboard-head"><div><p className="eyebrow">TUESDAY, 12 AUGUST</p><h1>Good morning, Dr. Chen.</h1><p>Here’s what needs your attention across your patient cohort.</p></div><button className="outline-button" onClick={() => notify("Report prepared for export")}>⇩ Export report</button></div>
            <div className="metric-row">
              <div className="metric-card alert"><span>URGENT ALERTS</span><strong>2</strong><p>1 new since yesterday</p><i>!</i></div>
              <div className="metric-card"><span>CHECK-INS DUE</span><strong>7</strong><p>3 completed today</p><i>↗</i></div>
              <div className="metric-card"><span>RESPONSE RATE</span><strong>91%</strong><p>Past 7 days</p><i>◎</i></div>
              <div className="metric-card"><span>ACTIVE PATIENTS</span><strong>24</strong><p>Across 4 protocols</p><i>♙</i></div>
            </div>
            <div className="dashboard-grid">
              <div className="cohort-card">
                <div className="card-title"><div><h2>Patient overview</h2><p>Sorted by clinical attention score</p></div><div className="filter-pills"><button className="active">All</button><button>Alerts</button><button>Due</button></div></div>
                <div className="patient-table">
                  <div className="table-head"><span>PATIENT</span><span>STATUS</span><span>LATEST SIGNAL</span><span>LAST CHECK-IN</span></div>
                  {patients.map((patient, index) => <button key={patient.id} className={`patient-row ${selectedPatient === index ? "selected" : ""}`} onClick={() => { setSelectedPatient(index); setAlertAcknowledged(false); }}>
                    <span className="patient-cell"><i className={`mini-avatar ${patient.color}`}>{patient.initials}</i><span><strong>{patient.name}</strong><small>{patient.id} · {patient.regimen}</small></span></span>
                    <span><em className={`risk ${patient.risk.toLowerCase()}`}>{patient.risk}</em></span><span><strong>{patient.issue}</strong><small>Attention score {patient.score}</small></span><span>{patient.time}<b>›</b></span>
                  </button>)}
                </div>
              </div>
              <aside className="detail-card">
                <div className="detail-person"><div className={`large-avatar ${selected.color}`}>{selected.initials}</div><div><h2>{selected.name}</h2><p>{selected.id} · Breast cancer</p></div><button>•••</button></div>
                <div className="detail-meta"><div><span>PROTOCOL</span><strong>VELA-BC-04</strong></div><div><span>CYCLE</span><strong>{selected.regimen}</strong></div></div>
                <div className={`alert-box ${alertAcknowledged ? "acknowledged" : ""}`}><div className="alert-top"><span>{alertAcknowledged ? "✓" : "!"}</span><div><strong>{alertAcknowledged ? "Alert acknowledged" : "Clinical review suggested"}</strong><small>Rule-based prototype signal</small></div></div><p>{selected.issue} was reported above the configured review threshold.</p><button onClick={() => { setAlertAcknowledged(true); notify("Alert acknowledged"); }}>{alertAcknowledged ? "Acknowledged" : "Acknowledge alert"}</button></div>
                <div className="trend-head"><div><h3>Symptom trend</h3><p>Patient-reported severity · 6 weeks</p></div><select aria-label="Choose symptom"><option>Fatigue</option><option>Nausea</option><option>Pain</option></select></div>
                <div className="chart" aria-label="Fatigue severity trend from mild to severe over six weeks"><div className="chart-labels"><span>Very severe</span><span>Severe</span><span>Moderate</span><span>Mild</span><span>None</span></div><div className="chart-area"><div className="grid-lines"><i/><i/><i/><i/><i/></div><div className="trend-line"><b style={{left:"2%",bottom:"18%"}}/><b style={{left:"20%",bottom:"26%"}}/><b style={{left:"39%",bottom:"42%"}}/><b style={{left:"58%",bottom:"39%"}}/><b style={{left:"77%",bottom:"62%"}}/><b style={{left:"96%",bottom:"78%"}}/></div><div className="dates"><span>8 Jul</span><span>15 Jul</span><span>22 Jul</span><span>29 Jul</span><span>5 Aug</span><span>12 Aug</span></div></div></div>
                <button className="secondary-button full" onClick={() => notify("Opening complete patient record")}>View full patient record →</button>
              </aside>
            </div>
            <p className="prototype-note">Prototype only · Signals are not CTCAE grades and must not replace clinical assessment.</p>
          </div>
        </section>
      )}
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
