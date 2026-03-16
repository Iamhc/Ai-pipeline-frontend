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
      const { num_nodes, num_edges, is_dag } = data;

      alert(
        `✅ Pipeline Analysis\n\n` +
        `📦 Nodes: ${num_nodes}\n` +
        `🔗 Edges: ${num_edges}\n` +
        `${is_dag ? '✅' : '❌'} DAG: ${is_dag ? 'Yes — no cycles detected' : 'No — cycle detected!'}`
      );
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
