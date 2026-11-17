// submit.js - Backend integration + Export/Import + Undo/Redo + Share link

import { useStore } from './store';
import { useStore as useZustandStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import { useState, useRef, useEffect } from 'react';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  nodeIDs: state.nodeIDs,
  loadPipeline: state.loadPipeline,
  clearPipeline: state.clearPipeline,
});

const HASH_KEY = '#p=';

// Keep only what's needed to rebuild the pipeline → shorter links
const slim = ({ nodes, edges, nodeIDs }) => ({
  nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
  edges: edges.map(({ id, source, target, sourceHandle, targetHandle, type, animated, markerEnd }) => ({
    id, source, target, sourceHandle, targetHandle, type, animated, markerEnd,
  })),
  nodeIDs,
});

export const SubmitButton = () => {
  const { nodes, edges, nodeIDs, loadPipeline, clearPipeline } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const canUndo = useZustandStore(useStore.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useZustandStore(useStore.temporal, (s) => s.futureStates.length > 0);
  const undo = () => useStore.temporal.getState().undo();
  const redo = () => useStore.temporal.getState().redo();

  // Ctrl+Z = undo, Ctrl+Y / Ctrl+Shift+Z = redo (Cmd on Mac)
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (k === 'y' || (k === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Load pipeline from share link (on open + when a link is pasted in the same tab)
  useEffect(() => {
    const loadFromHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith(HASH_KEY)) return;
      try {
        const json = decompressFromEncodedURIComponent(hash.slice(HASH_KEY.length));
        const data = JSON.parse(json);
        if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) throw new Error('bad data');
        useStore.getState().loadPipeline(data);
      } catch {
        alert('❌ Invalid or corrupted share link');
      }
      // Clean the URL so a refresh uses session storage instead of re-loading the link
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    };
    loadFromHash();
    window.addEventListener('hashchange', loadFromHash);
    return () => window.removeEventListener('hashchange', loadFromHash);
  }, []);

  const shareLink = async () => {
    const encoded = compressToEncodedURIComponent(JSON.stringify(slim({ nodes, edges, nodeIDs })));
    const url = `${window.location.origin}${window.location.pathname}${HASH_KEY}${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url); // fallback if clipboard is blocked
    }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges, nodeIDs }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pipeline.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) throw new Error('Invalid pipeline file');
      loadPipeline(data);
    } catch (err) {
      alert(`❌ Import failed: ${err.message}`);
    }
    e.target.value = '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const { num_nodes, num_edges, is_dag, llm_token_usage } = data;

      let message =
        `✅ Pipeline Analysis\n\n` +
        `📦 Nodes: ${num_nodes}\n` +
        `🔗 Edges: ${num_edges}\n` +
        `${is_dag ? '✅' : '❌'} DAG: ${is_dag ? 'Yes — no cycles detected' : 'No — cycle detected!'}`;

      if (llm_token_usage && llm_token_usage.length > 0) {
        message += `\n\n🧮 Token Usage:`;
        llm_token_usage.forEach((usage) => {
          message +=
            `\n${usage.model}: ${usage.tokens_used.toLocaleString()} / ${usage.max_tokens.toLocaleString()} tokens used ` +
            `(${usage.percent_used}%) — ${usage.tokens_remaining.toLocaleString()} remaining`;
        });
      }

      alert(message);
    } catch (err) {
      alert(`❌ Error connecting to backend:\n${err.message}\n\nMake sure the backend is running on http://127.0.0.1:8000`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-bar">
      <button className="submit-btn" onClick={undo} disabled={!canUndo} title="Ctrl+Z">↶ Undo</button>
      <button className="submit-btn" onClick={redo} disabled={!canRedo} title="Ctrl+Y">↷ Redo</button>
      <button className="submit-btn" onClick={shareLink} disabled={!nodes.length}>
        {copied ? '✅ Link copied!' : '🔗 Share'}
      </button>
      <button className="submit-btn" onClick={exportJSON} disabled={!nodes.length}>⬇ Export</button>
      <button className="submit-btn" onClick={() => fileRef.current.click()}>⬆ Import</button>
      <input ref={fileRef} type="file" accept=".json" hidden onChange={importJSON} />
      <button className="submit-btn" onClick={clearPipeline}>🗑 Clear</button>

      <button
        className={`submit-btn ${loading ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <><span className="spinner" /> Analyzing...</>
        ) : (
          <><span>▶</span> Submit Pipeline</>
        )}
      </button>
    </div>
  );
};