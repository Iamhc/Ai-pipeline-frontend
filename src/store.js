// store.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { temporal } from "zundo";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

// Only compare meaningful fields, so select/hover/resize don't create history entries
const snapshot = (s) =>
  JSON.stringify({
    n: s.nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
    e: s.edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
      id, source, target, sourceHandle, targetHandle,
    })),
  });

// Records the first change of a burst (drag / typing) as ONE undo step
const leadingDebounce = (fn, ms) => {
  let t = null;
  return (...args) => {
    if (!t) fn(...args);
    clearTimeout(t);
    t = setTimeout(() => (t = null), ms);
  };
};

export const useStore = create(
  temporal(
    persist(
      (set, get) => ({
        nodes: [],
        edges: [],
        nodeIDs: {},
        getNodeID: (type) => {
          const ids = { ...get().nodeIDs };
          ids[type] = (ids[type] || 0) + 1;
          set({ nodeIDs: ids });
          return `${type}-${ids[type]}`;
        },
        addNode: (node) => set({ nodes: [...get().nodes, node] }),
        onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
        onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
        onConnect: (connection) =>
          set({
            edges: addEdge(
              {
                ...connection,
                type: "smoothstep",
                animated: true,
                markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
              },
              get().edges
            ),
          }),
        updateNodeField: (nodeId, fieldName, fieldValue) =>
          set({
            nodes: get().nodes.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, [fieldName]: fieldValue } } : n
            ),
          }),
        clearPipeline: () => set({ nodes: [], edges: [], nodeIDs: {} }),
        loadPipeline: ({ nodes, edges, nodeIDs }) =>
          set({ nodes, edges, nodeIDs: nodeIDs || {} }),
      }),
      {
        name: "vectorshift-pipeline",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (s) => ({ nodes: s.nodes, edges: s.edges, nodeIDs: s.nodeIDs }),
      }
    ),
    {
      partialize: (s) => ({ nodes: s.nodes, edges: s.edges }), // nodeIDs never rewinds → no ID clashes
      equality: (a, b) => snapshot(a) === snapshot(b),
      handleSet: (handleSet) => leadingDebounce(handleSet, 400),
      limit: 50,
    }
  )
);

// Session restore shouldn't be an undo step (otherwise Ctrl+Z after reload wipes the canvas)
useStore.temporal.getState().clear();