// historyStore.js - saved pipelines list (like chat history)

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from './store';

const slim = ({ nodes = [], edges = [], nodeIDs = {} }) => ({
  nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
  edges: edges.map(({ id, source, target, sourceHandle, targetHandle, type, animated, markerEnd }) => ({
    id, source, target, sourceHandle, targetHandle, type, animated, markerEnd,
  })),
  nodeIDs: nodeIDs || {},
});

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const usePipelineHistory = create(
  persist(
    (set, get) => ({
      pipelines: [],
      activeId: null,
      counter: 0,
      _create: (data = {}, name) => {
        const n = get().counter + 1;
        const p = { id: uid(), name: name || `Pipeline ${n}`, ...slim(data), updatedAt: Date.now() };
        set({ pipelines: [p, ...get().pipelines], activeId: p.id, counter: n });
        return p;
      },
      _save: (id, data) =>
        set({
          pipelines: get().pipelines.map((p) =>
            p.id === id ? { ...p, ...slim(data), updatedAt: Date.now() } : p
          ),
        }),
      rename: (id, name) =>
        set({
          pipelines: get().pipelines.map((p) =>
            p.id === id ? { ...p, name: name.trim() || p.name } : p
          ),
        }),
    }),
    { name: 'vectorshift-history', storage: createJSONStorage(() => localStorage) }
  )
);

// ---------- helpers ----------
let timer = null;
let started = false;

const canvas = () => {
  const s = useStore.getState();
  return { nodes: s.nodes, edges: s.edges, nodeIDs: s.nodeIDs };
};

const byRecent = (list) => [...list].sort((a, b) => b.updatedAt - a.updatedAt);

const showOnCanvas = (p) => {
  useStore.getState().loadPipeline({ nodes: p.nodes, edges: p.edges, nodeIDs: p.nodeIDs });
  useStore.temporal.getState().clear(); // undo shouldn't jump into another pipeline
};

export const saveNow = () => {
  clearTimeout(timer);
  timer = null;
  const { activeId, _save } = usePipelineHistory.getState();
  if (activeId) _save(activeId, canvas());
};

export const newPipeline = () => {
  saveNow();
  showOnCanvas(usePipelineHistory.getState()._create());
};

export const openAsNewPipeline = (data, name) => {
  saveNow();
  showOnCanvas(usePipelineHistory.getState()._create(data, name));
};

export const switchTo = (id) => {
  const { activeId, pipelines } = usePipelineHistory.getState();
  if (id === activeId) return;
  saveNow(); // flush current before leaving
  const p = pipelines.find((x) => x.id === id);
  if (!p) return;
  usePipelineHistory.setState({ activeId: id });
  showOnCanvas(p);
};

export const deletePipeline = (id) => {
  const { pipelines, activeId, _create } = usePipelineHistory.getState();
  const rest = pipelines.filter((p) => p.id !== id);
  usePipelineHistory.setState({ pipelines: rest });
  if (id !== activeId) return;
  clearTimeout(timer); // don't save the deleted canvas anywhere
  timer = null;
  if (rest.length) {
    const next = byRecent(rest)[0];
    usePipelineHistory.setState({ activeId: next.id });
    showOnCanvas(next);
  } else {
    showOnCanvas(_create());
  }
};

// Call once on app start: picks/creates active pipeline + auto-saves canvas changes
export const initHistorySync = () => {
  if (started) return () => {};
  started = true;

  const h = usePipelineHistory.getState();
  const c = canvas();
  let active = h.pipelines.find((p) => p.id === h.activeId) || byRecent(h.pipelines)[0];

  if (!active) {
    h._create(c);
  } else {
    usePipelineHistory.setState({ activeId: active.id });
    if (!c.nodes.length && active.nodes.length) showOnCanvas(active); // fresh tab → reopen last pipeline
    else saveNow();
  }

  const unsub = useStore.subscribe((s, prev) => {
    if (s.nodes === prev.nodes && s.edges === prev.edges) return;
    clearTimeout(timer);
    timer = setTimeout(saveNow, 500);
  });
  window.addEventListener('beforeunload', saveNow);

  return () => {
    unsub();
    window.removeEventListener('beforeunload', saveNow);
    started = false;
  };
};