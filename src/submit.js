// submit.js - Part 4: Backend integration

import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { useState } from 'react';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);

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