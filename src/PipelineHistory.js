// PipelineHistory.js - sidebar with saved pipelines

import { useEffect, useState } from 'react';
import { usePipelineHistory, initHistorySync, newPipeline, switchTo, deletePipeline } from './historyStore';

const ago = (t) => {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 2, opacity: 0.8,
};

export const PipelineHistory = () => {
  const pipelines = usePipelineHistory((s) => s.pipelines);
  const activeId = usePipelineHistory((s) => s.activeId);
  const rename = usePipelineHistory((s) => s.rename);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState('');
  const [hover, setHover] = useState(null);

  useEffect(() => initHistorySync(), []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !editing && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editing]);

  const sorted = [...pipelines].sort((a, b) => b.updatedAt - a.updatedAt);

  const startEdit = (p) => {
    setEditing(p.id);
    setDraft(p.name);
  };
  const commit = () => {
    if (editing) rename(editing, draft);
    setEditing(null);
  };

  return (
    <>
      {/* Toggle button (hidden while sidebar is open) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', left: 16, bottom: 16, zIndex: 1001,
            padding: '10px 14px', borderRadius: 10, border: '1px solid #333',
            background: '#1f1f1f', color: '#fff', cursor: 'pointer', fontSize: 13,
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}
        >
          ☰ Menu
        </button>
      )}

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 999 }}
          />

          {/* Sidebar */}
          <div
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: 270, zIndex: 1000,
              background: '#171717', color: '#eee', display: 'flex', flexDirection: 'column',
              boxShadow: '4px 0 20px rgba(0,0,0,0.4)', fontFamily: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 14px 8px' }}>
              <strong style={{ fontSize: 16 }}>Pipelines</strong>
              <button onClick={() => setOpen(false)} style={{ ...iconBtn, color: '#aaa', fontSize: 16 }}>✕</button>
            </div>

            <button
              onClick={newPipeline}
              style={{
                margin: '4px 10px 12px', padding: '9px 12px', borderRadius: 8, border: '1px solid #333',
                background: '#262626', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14,
              }}
            >
              ＋ New pipeline
            </button>

            <div style={{ fontSize: 11, color: '#888', padding: '0 14px 6px' }}>Recents</div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 6px 10px' }}>
              {sorted.map((p) => {
                const isActive = p.id === activeId;
                const showActions = (hover === p.id || isActive) && editing !== p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => editing !== p.id && switchTo(p.id)}
                    onDoubleClick={() => startEdit(p)}
                    onMouseEnter={() => setHover(p.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 8,
                      cursor: 'pointer', marginBottom: 2,
                      background: isActive ? '#2f2f2f' : hover === p.id ? '#242424' : 'transparent',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {editing === p.id ? (
                        <input
                          autoFocus
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={commit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commit();
                            if (e.key === 'Escape') setEditing(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '100%', background: '#111', color: '#fff', border: '1px solid #555',
                            borderRadius: 4, padding: '2px 6px', fontSize: 14,
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: '#888' }}>
                        {p.nodes.length} nodes · {ago(p.updatedAt)}
                      </div>
                    </div>

                    {showActions && (
                      <>
                        <button
                          title="Rename"
                          onClick={(e) => { e.stopPropagation(); startEdit(p); }}
                          style={iconBtn}
                        >✏️</button>
                        <button
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${p.name}"?`)) deletePipeline(p.id);
                          }}
                          style={iconBtn}
                        >🗑</button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact us */}
            <a
              href="mailto:himanshuchaudhary586@gmail.com?subject=VectorShift%20Pipeline%20-%20Contact"
              style={{
                margin: '0 10px 14px', padding: '10px 12px', borderRadius: 8,
                border: '1px solid #333', background: '#262626', color: '#fff',
                textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              ✉️ Contact us
            </a>
          </div>
        </>
      )}
    </>
  );
};