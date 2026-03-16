// textNode.js - Part 3: auto-resize + dynamic variable handles

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode, NodeField } from './BaseNode';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

function extractVariables(text) {
  const vars = [];
  const seen = new Set();
  let match;
  const regex = new RegExp(VAR_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (!seen.has(match[1])) {
      seen.add(match[1]);
      vars.push(match[1]);
    }
  }
  return vars;
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 220, height: 'auto' });

  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);
  }, [currText]);

  // Auto-resize: grow width based on longest line, height based on lines
  useEffect(() => {
    const lines = currText.split('\n');
    const longestLine = Math.max(...lines.map((l) => l.length), 10);
    const newWidth = Math.max(220, Math.min(480, longestLine * 8 + 60));
    setDimensions({ width: newWidth });
  }, [currText]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currText]);

  const color = '#fb923c';

  return (
    <div
      style={{
        minWidth: dimensions.width,
        background: 'var(--node-bg)',
        border: `1.5px solid ${color}`,
        borderRadius: '12px',
        boxShadow: `0 0 0 1px rgba(0,0,0,0.3), 0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${color}22`,
        fontFamily: "'DM Mono', 'Fira Code', monospace",
        position: 'relative',
        transition: 'min-width 0.15s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          borderBottom: `1px solid ${color}44`,
          padding: '8px 12px',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '14px' }}>📝</span>
        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color }}>
          Text
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NodeField label="Content">
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={(e) => setCurrText(e.target.value)}
            rows={1}
            style={{
              background: 'var(--field-bg)',
              border: '1px solid var(--field-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              padding: '5px 8px',
              fontSize: '12px',
              fontFamily: 'inherit',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              resize: 'none',
              overflow: 'hidden',
              transition: 'border-color 0.15s',
              minHeight: '32px',
            }}
            onFocus={(e) => (e.target.style.borderColor = color)}
            onBlur={(e) => (e.target.style.borderColor = 'var(--field-border)')}
          />
        </NodeField>

        {/* Show detected variables */}
        {variables.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {variables.map((v) => (
              <span
                key={v}
                style={{
                  background: `${color}22`,
                  border: `1px solid ${color}55`,
                  borderRadius: '4px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  color,
                }}
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic variable input handles on the left */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{
              top: `${((i + 1) / (variables.length + 1)) * 100}%`,
              background: color,
              border: '2px solid var(--node-bg)',
              width: '10px',
              height: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '14px',
              top: `${((i + 1) / (variables.length + 1)) * 100}%`,
              transform: 'translateY(-50%)',
              fontSize: '9px',
              color: '#888',
              pointerEvents: 'none',
            }}
          >
            {varName}
          </div>
        </div>
      ))}

      {/* Output handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          top: '50%',
          background: color,
          border: '2px solid var(--node-bg)',
          width: '10px',
          height: '10px',
        }}
      />
    </div>
  );
};
