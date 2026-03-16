// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  const nodes = [
    { type: 'customInput', label: 'Input', icon: '📥', color: '#22d3ee' },
    { type: 'customOutput', label: 'Output', icon: '📤', color: '#f472b6' },
    { type: 'llm', label: 'LLM', icon: '🧠', color: '#a78bfa' },
    { type: 'text', label: 'Text', icon: '📝', color: '#fb923c' },
    { type: 'api', label: 'API', icon: '🌐', color: '#34d399' },
    { type: 'condition', label: 'Condition', icon: '🔀', color: '#fbbf24' },
    { type: 'transform', label: 'Transform', icon: '⚡', color: '#60a5fa' },
    { type: 'note', label: 'Note', icon: '🗒️', color: '#facc15' },
    { type: 'database', label: 'Database', icon: '🗄️', color: '#e879f9' },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-logo">⬡</span>
        <span className="toolbar-title">VectorShift</span>
      </div>
      <div className="toolbar-nodes">
        {nodes.map((n) => (
          <DraggableNode key={n.type} type={n.type} label={n.label} icon={n.icon} color={n.color} />
        ))}
      </div>
    </div>
  );
};
