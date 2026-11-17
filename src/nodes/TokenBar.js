// nodes/TokenBar.js - live token usage bar for LLM node

import { useEffect, useState } from 'react';
import { useStore } from '../store';

const API = 'http://127.0.0.1:8000/models/token-usage';

// Same logic as backend resolve_incoming_text(): text of node connected to this handle
const incomingText = (s, id, handle) => {
  const edge = s.edges.find(
    (e) => e.target === id && (e.targetHandle || '').endsWith(`-${handle}`)
  );
  if (!edge) return '';
  const d = s.nodes.find((n) => n.id === edge.source)?.data || {};
  return d.value || d.text || d.note || '';
};

export const TokenBar = ({ id }) => {
  // Selectors return strings → re-render only when the text actually changes
  const system = useStore((s) => incomingText(s, id, 'system'));
  const prompt = useStore((s) => incomingText(s, id, 'prompt'));
  const model = useStore((s) => s.nodes.find((n) => n.id === id)?.data?.model || 'GPT-4o');

  const [usage, setUsage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, system, prompt }),
          signal: ctrl.signal,
        });
        if (!r.ok) throw new Error(r.status);
        setUsage(await r.json());
        setError(false);
      } catch (e) {
        if (e.name !== 'AbortError') setError(true);
      }
    }, 400); // debounce typing
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [model, system, prompt]);

  const wrap = { marginTop: 8, fontSize: 11, opacity: 0.9 };

  if (error) return <div style={wrap}>⚠ Token count unavailable</div>;
  if (!usage) return <div style={wrap}>🧮 Counting…</div>;

  const pct = Math.min(100, usage.percent_used);
  const color = pct < 50 ? '#22c55e' : pct < 80 ? '#f59e0b' : '#ef4444';

  return (
    <div style={wrap} title={`${usage.tokens_remaining.toLocaleString()} tokens remaining`}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>🧮 {usage.tokens_used.toLocaleString()} / {usage.max_tokens.toLocaleString()}</span>
        <span>{usage.percent_used}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
        <div
          style={{
            width: `${usage.tokens_used > 0 ? Math.max(pct, 1) : 0}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s, background 0.3s',
          }}
        />
      </div>
    </div>
  );
};