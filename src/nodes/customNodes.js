// customNodes.js - 5 new nodes built using BaseNode abstraction

import { useState } from 'react';
import { BaseNode, NodeField, NodeInput, NodeSelect, NodeTextarea } from './BaseNode';

// ─── 1. API Request Node ────────────────────────────────────────────────────
export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || 'https://api.example.com/');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      id={id}
      title="API Request"
      icon="🌐"
      color="#34d399"
      inputs={[{ id: 'body', label: 'body' }, { id: 'headers', label: 'headers' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'status', label: 'status' }]}
    >
      <NodeField label="URL">
        <NodeInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </NodeField>
      <NodeField label="Method">
        <NodeSelect
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          options={[
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'DELETE', label: 'DELETE' },
          ]}
        />
      </NodeField>
    </BaseNode>
  );
};

// ─── 2. Conditional / If-Else Node ─────────────────────────────────────────
export const ConditionNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  return (
    <BaseNode
      id={id}
      title="Condition"
      icon="🔀"
      color="#fbbf24"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'true', label: 'true' }, { id: 'false', label: 'false' }]}
    >
      <NodeField label="Condition">
        <NodeInput
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g. value > 0"
        />
      </NodeField>
      <div style={{ fontSize: '10px', color: '#666' }}>
        Routes to <span style={{ color: '#4ade80' }}>true</span> or{' '}
        <span style={{ color: '#f87171' }}>false</span> output
      </div>
    </BaseNode>
  );
};

// ─── 3. Data Transform Node ─────────────────────────────────────────────────
export const TransformNode = ({ id, data }) => {
  const [transform, setTransform] = useState(data?.transform || 'JSON.parse(input)');
  const [label, setLabel] = useState(data?.label || 'transform');

  return (
    <BaseNode
      id={id}
      title="Transform"
      icon="⚡"
      color="#60a5fa"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
    >
      <NodeField label="Label">
        <NodeInput value={label} onChange={(e) => setLabel(e.target.value)} />
      </NodeField>
      <NodeField label="Expression">
        <NodeTextarea
          value={transform}
          onChange={(e) => setTransform(e.target.value)}
          rows={2}
          placeholder="JavaScript expression..."
        />
      </NodeField>
    </BaseNode>
  );
};

// ─── 4. Note / Comment Node ─────────────────────────────────────────────────
export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add your notes here...');
  const [color, setColor] = useState(data?.color || '#facc15');

  const colors = ['#facc15', '#86efac', '#93c5fd', '#f9a8d4', '#c4b5fd'];

  return (
    <BaseNode
      id={id}
      title="Note"
      icon="🗒️"
      color={color}
      style={{ minWidth: 180 }}
    >
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {colors.map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: c,
              cursor: 'pointer',
              border: color === c ? '2px solid white' : '2px solid transparent',
            }}
          />
        ))}
      </div>
      <NodeTextarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Write a note..."
        style={{ fontSize: '11px' }}
      />
    </BaseNode>
  );
};

// ─── 5. Database Query Node ─────────────────────────────────────────────────
export const DatabaseNode = ({ id, data }) => {
  const [query, setQuery] = useState(data?.query || 'SELECT * FROM table WHERE id = {{id}}');
  const [dbType, setDbType] = useState(data?.dbType || 'postgres');

  return (
    <BaseNode
      id={id}
      title="Database"
      icon="🗄️"
      color="#e879f9"
      inputs={[{ id: 'params', label: 'params' }, { id: 'connection', label: 'conn' }]}
      outputs={[{ id: 'rows', label: 'rows' }, { id: 'error', label: 'error' }]}
      minWidth={240}
    >
      <NodeField label="Database">
        <NodeSelect
          value={dbType}
          onChange={(e) => setDbType(e.target.value)}
          options={[
            { value: 'postgres', label: 'PostgreSQL' },
            { value: 'mysql', label: 'MySQL' },
            { value: 'sqlite', label: 'SQLite' },
            { value: 'mongo', label: 'MongoDB' },
          ]}
        />
      </NodeField>
      <NodeField label="Query">
        <NodeTextarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={2}
          placeholder="SELECT ..."
        />
      </NodeField>
    </BaseNode>
  );
};
