import React, { useState } from 'react';

const CONTENT_TYPES = ['LinkedIn', 'Twitter', 'Blog', 'Hindi', 'Telugu'];

const icons = {
  LinkedIn: '💼',
  Twitter:  '🐦',
  Blog:     '📝',
  Hindi:    '🇮🇳',
  Telugu:   '🌺',
};

const css = `
@keyframes fadeIn  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }
@keyframes pulse   { 0%,100% { opacity:1 } 50% { opacity:.4 } }
@keyframes spin    { to { transform: rotate(360deg) } }

.app        { min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:48px 16px 80px; }
.header     { text-align:center; margin-bottom:48px; animation:fadeIn .6s both; }
.logo       { font-size:clamp(28px,5vw,48px); font-weight:800; letter-spacing:-1px;
              background:linear-gradient(135deg,var(--accent),var(--accent2));
              -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.tagline    { color:var(--muted); font-size:14px; margin-top:6px; letter-spacing:.08em; text-transform:uppercase; }

.card       { width:100%; max-width:720px; background:var(--surface); border:1px solid var(--border);
              border-radius:16px; padding:32px; animation:fadeIn .5s both; }

label       { display:block; font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
              color:var(--muted); margin-bottom:10px; }

textarea    { width:100%; background:var(--bg); border:1px solid var(--border); border-radius:10px;
              color:var(--text); font-family:var(--font-ui); font-size:15px; padding:14px 16px;
              resize:vertical; min-height:100px; outline:none; transition:border .2s;
              line-height:1.6; }
textarea:focus { border-color:var(--accent); }

.chips      { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:28px; }
.chip       { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:50px;
              border:1px solid var(--border); background:transparent; color:var(--muted);
              font-family:var(--font-ui); font-size:13px; font-weight:600; cursor:pointer;
              transition:all .15s; }
.chip.on    { border-color:var(--accent); background:rgba(56,189,248,.1); color:var(--accent); }

.btn        { width:100%; padding:15px; border-radius:10px; border:none; cursor:pointer;
              font-family:var(--font-ui); font-size:15px; font-weight:700; letter-spacing:.04em;
              background:linear-gradient(135deg,var(--accent),var(--accent2));
              color:#080c14; transition:opacity .2s, transform .1s; }
.btn:hover  { opacity:.9; transform:translateY(-1px); }
.btn:active { transform:translateY(0); }
.btn:disabled { opacity:.4; cursor:not-allowed; transform:none; }

.spinner    { width:18px; height:18px; border:2px solid rgba(8,12,20,.3); border-top-color:#080c14;
              border-radius:50%; animation:spin .7s linear infinite; display:inline-block; margin-right:8px; vertical-align:middle; }

.error-box  { margin-top:20px; padding:14px 18px; border-radius:10px; border:1px solid var(--error);
              background:rgba(248,113,113,.08); color:var(--error); font-size:13px; }

.results    { margin-top:32px; display:flex; flex-direction:column; gap:20px; animation:fadeIn .5s both; }

.section    { border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.sec-head   { display:flex; align-items:center; gap:10px; padding:14px 18px;
              background:rgba(255,255,255,.02); border-bottom:1px solid var(--border); }
.sec-icon   { font-size:18px; }
.sec-title  { font-size:13px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
.sec-badge  { margin-left:auto; font-size:11px; font-weight:700; padding:3px 10px; border-radius:50px; }
.badge-pass { background:rgba(52,211,153,.15); color:var(--success); }
.badge-fail { background:rgba(248,113,113,.15); color:var(--error); }

.sec-body   { padding:18px; font-size:14px; line-height:1.75; color:var(--text); }
.sec-body p { white-space:pre-wrap; }
pre         { font-family:var(--font-mono); font-size:13px; white-space:pre-wrap; line-height:1.7; }

.tags       { display:flex; flex-wrap:wrap; gap:8px; }
.tag        { padding:4px 12px; border-radius:50px; background:rgba(129,140,248,.12);
              color:var(--accent2); font-size:12px; font-weight:600; }

.grid2      { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.mini-card  { background:rgba(255,255,255,.02); border:1px solid var(--border); border-radius:8px; padding:12px; }
.mini-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); margin-bottom:4px; }
.mini-val   { font-size:13px; color:var(--text); }

.tips       { list-style:none; display:flex; flex-direction:column; gap:8px; }
.tips li    { display:flex; gap:10px; font-size:14px; }
.tips li::before { content:'→'; color:var(--accent); flex-shrink:0; }

@media (max-width:480px) { .grid2 { grid-template-columns:1fr; } }
`;

export default function App() {
  const [topic,    setTopic]    = useState('');
  const [types,    setTypes]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [result,   setResult]   = useState(null);

  const toggle = t => setTypes(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);

  const generate = async () => {
    if (!topic.trim()) { setError('Please enter a topic.'); return; }
    if (!types.length) { setError('Select at least one content type.'); return; }
    setError(''); setLoading(true); setResult(null);
    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, content_types: types }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || 'Server error');
      setResult(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const d = result;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="logo">ContentFlow AI</div>
          <div className="tagline">Multi-Agent Enterprise Content Engine</div>
        </div>

        <div className="card">
          <label>Topic</label>
          <textarea
            placeholder="e.g. How AI is transforming healthcare in 2025…"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            style={{ marginBottom: 24 }}
          />

          <label>Content Types</label>
          <div className="chips">
            {CONTENT_TYPES.map(t => (
              <button key={t} className={`chip ${types.includes(t) ? 'on' : ''}`} onClick={() => toggle(t)}>
                {icons[t]} {t}
              </button>
            ))}
          </div>

          <button className="btn" onClick={generate} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Generating…' : '⚡ Generate Content'}
          </button>

          {error && <div className="error-box">⚠ {error}</div>}
        </div>

        {d && (
          <div className="results" style={{ width: '100%', maxWidth: 720 }}>

            {/* Raw Content */}
            <div className="section">
              <div className="sec-head">
                <span className="sec-icon">✍️</span>
                <span className="sec-title">Generated Content</span>
              </div>
              <div className="sec-body"><p>{d.content_generator?.raw_content}</p></div>
            </div>

            {/* Compliance */}
            <div className="section">
              <div className="sec-head">
                <span className="sec-icon">🛡️</span>
                <span className="sec-title">Compliance Check</span>
                <span className={`sec-badge ${d.compliance?.status === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                  {d.compliance?.status}
                </span>
              </div>
              <div className="sec-body">
                {d.compliance?.issues?.length > 0 && (
                  <p style={{ color: 'var(--error)', marginBottom: 12 }}>
                    Issues: {d.compliance.issues.join(', ')}
                  </p>
                )}
                <p>{d.compliance?.approved_content}</p>
              </div>
            </div>

            {/* Distribution */}
            {(d.distribution?.linkedin || d.distribution?.twitter || d.distribution?.blog) && (
              <div className="section">
                <div className="sec-head">
                  <span className="sec-icon">📡</span>
                  <span className="sec-title">Distribution</span>
                </div>
                <div className="sec-body" style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {d.distribution.linkedin && (
                    <div>
                      <div className="mini-label">💼 LinkedIn</div>
                      <p>{d.distribution.linkedin}</p>
                    </div>
                  )}
                  {d.distribution.twitter && (
                    <div>
                      <div className="mini-label">🐦 Twitter / X</div>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:13 }}>{d.distribution.twitter}</p>
                    </div>
                  )}
                  {d.distribution.blog && (
                    <div>
                      <div className="mini-label">📝 Blog</div>
                      <p>{d.distribution.blog}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Localization */}
            {(d.localization?.hindi || d.localization?.telugu) && (
              <div className="section">
                <div className="sec-head">
                  <span className="sec-icon">🌐</span>
                  <span className="sec-title">Localization</span>
                </div>
                <div className="sec-body" style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {d.localization.hindi && (
                    <div>
                      <div className="mini-label">🇮🇳 Hindi</div>
                      <p>{d.localization.hindi}</p>
                    </div>
                  )}
                  {d.localization.telugu && (
                    <div>
                      <div className="mini-label">🌺 Telugu</div>
                      <p>{d.localization.telugu}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Intelligence */}
            {d.intelligence && (
              <div className="section">
                <div className="sec-head">
                  <span className="sec-icon">🧠</span>
                  <span className="sec-title">Intelligence Report</span>
                </div>
                <div className="sec-body" style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  {d.intelligence.hashtags?.length > 0 && (
                    <div>
                      <div className="mini-label" style={{ marginBottom:10 }}>Hashtags</div>
                      <div className="tags">
                        {d.intelligence.hashtags.map(h => <span key={h} className="tag">#{h}</span>)}
                      </div>
                    </div>
                  )}
                  {d.intelligence.best_time && Object.keys(d.intelligence.best_time).length > 0 && (
                    <div>
                      <div className="mini-label" style={{ marginBottom:10 }}>Best Posting Times</div>
                      <div className="grid2">
                        {Object.entries(d.intelligence.best_time).map(([k,v]) => (
                          <div key={k} className="mini-card">
                            <div className="mini-label">{k}</div>
                            <div className="mini-val">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {d.intelligence.improvements?.length > 0 && (
                    <div>
                      <div className="mini-label" style={{ marginBottom:10 }}>Improvement Tips</div>
                      <ul className="tips">
                        {d.intelligence.improvements.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
