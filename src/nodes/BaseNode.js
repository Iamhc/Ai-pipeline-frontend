// BaseNode.js - Abstraction for all nodes

import { Handle, Position } from 'reactflow';

/**
 * BaseNode abstraction
 *
 * Props:
 *  - id: node id
 *  - title: string label shown in the header
 *  - icon: emoji or string icon
 *  - color: accent color (CSS string)
 *  - inputs: array of { id, label, style? }  → target handles on the left
 *  - outputs: array of { id, label, style? } → source handles on the right
 *  - children: inner content (fields, selects, etc.)
 */
export const BaseNode = ({
  id,
  title,
  icon = '⚙️',
  color = '#6366f1',
  inputs = [],
  outputs = [],
  children,
  minWidth = 220,
  style = {},
}) => {
  return (
    <div
      className="base-node"
      style={{
        minWidth,
        background: 'var(--node-bg)',
        border: `1.5px solid ${color}`,
        borderRadius: '12px',
        boxShadow: `0 0 0 1px rgba(0,0,0,0.3), 0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${color}22`,
        overflow: 'visible',
        fontFamily: "'DM Mono', 'Fira Code', monospace",
        position: 'relative',
        ...style,
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
        <span style={{ fontSize: '14px' }}>{icon}</span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color,
          }}
        >
          {title}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>

      {/* Input Handles (Left) */}
      {inputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{
              top: inputs.length === 1
                ? '50%'
                : `${((i + 1) / (inputs.length + 1)) * 100}%`,
              background: color,
              border: '2px solid var(--node-bg)',
              width: '10px',
              height: '10px',
              ...handle.style,
            }}
          />
          {handle.label && (
            <div
              style={{
                position: 'absolute',
                left: '14px',
                top: inputs.length === 1
                  ? '50%'
                  : `${((i + 1) / (inputs.length + 1)) * 100}%`,
                transform: 'translateY(-50%)',
                fontSize: '9px',
                color: '#888',
                pointerEvents: 'none',
              }}
            >
              {handle.label}
            </div>
          )}
        </div>
      ))}

      {/* Output Handles (Right) */}
      {outputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            style={{
              top: outputs.length === 1
                ? '50%'
                : `${((i + 1) / (outputs.length + 1)) * 100}%`,
              background: color,
              border: '2px solid var(--node-bg)',
              width: '10px',
              height: '10px',
              ...handle.style,
            }}
          />
          {handle.label && (
            <div
              style={{
                position: 'absolute',
                right: '14px',
                top: outputs.length === 1
                  ? '50%'
                  : `${((i + 1) / (outputs.length + 1)) * 100}%`,
                transform: 'translateY(-50%)',
                fontSize: '9px',
                color: '#888',
                textAlign: 'right',
                pointerEvents: 'none',
              }}
            >
              {handle.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Reusable styled field components for use inside nodes
export const NodeField = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    {label && (
      <label style={{ fontSize: '10px', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
    )}
    {children}
  </div>
);

export const NodeInput = (props) => (
  <input
    {...props}
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
      transition: 'border-color 0.15s',
      ...props.style,
    }}
    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; if (props.onFocus) props.onFocus(e); }}
    onBlur={(e) => { e.target.style.borderColor = 'var(--field-border)'; if (props.onBlur) props.onBlur(e); }}
  />
);

export const NodeSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
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
      cursor: 'pointer',
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export const NodeTextarea = (props) => (
  <textarea
    {...props}
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
      transition: 'border-color 0.15s',
      ...props.style,
    }}
    onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; if (props.onFocus) props.onFocus(e); }}
    onBlur={(e) => { e.target.style.borderColor = 'var(--field-border)'; if (props.onBlur) props.onBlur(e); }}
  />
);
