# 🧩 AI Pipeline Builder — Frontend

A visual, drag-and-drop, no-code editor for designing AI workflows, built with **React** and **React Flow**. Connect Input, Text, LLM and Output nodes, see live token usage per LLM, manage multiple pipelines, and validate them against a FastAPI backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![ReactFlow](https://img.shields.io/badge/React%20Flow-11-ff0072) ![Zustand](https://img.shields.io/badge/Zustand-state-orange)

## ✨ Features

### Pipeline editor
- 🖱️ **Drag-and-drop node editor** built on React Flow
- 🧠 **Multiple node types**: Input, Text, LLM and Output, all built on a reusable `BaseNode` abstraction
- 🔄 **DAG validation**: the backend detects cycles and reports node/edge counts on submit
- 🆔 **Collision-free node IDs** that persist across reloads and imports

### LLM tooling
- 🧮 **Live token counter** on every LLM node: a progress bar updates as you type (debounced)
- 🎨 **Colour-coded usage**: green < 50%, amber < 80%, red above that
- 🤖 **Model selector**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo, Claude 3.5 Sonnet, each with its own context limit

### Workspace
- 📂 **Pipeline history sidebar** (☰ Menu, like a chat history): create, switch, rename and delete pipelines
- 💾 **Auto-save**: every change is saved to `localStorage` within 0.5s
- 🕘 **Node count and "last edited" time** for each pipeline in the sidebar; `Esc` closes it
- 🔁 **Session persistence**: the canvas survives page refresh
- ↶ **Undo / Redo** (`Ctrl+Z` / `Ctrl+Y`): a drag or typing burst counts as one step, and selection clicks are ignored
- 🧹 **Undo history resets when switching pipelines**, so Ctrl+Z never leaks work from another pipeline
- 🔗 **Shareable links**: the pipeline is compressed into the URL, no backend needed
- ⬇️⬆️ **Export / Import JSON**
- 📥 **Import & shared links open as a new pipeline**, so your current work is never overwritten
- ✅ **Import validation**: invalid or corrupted files and links are rejected with a clear error
- 🗑️ **Clear canvas**
- ✉️ **Contact us** from the sidebar

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React (Create React App) | UI framework |
| React Flow | Node-based graph editor |
| Zustand | Global state management |
| zundo | Undo/redo middleware for Zustand |
| lz-string | URL-safe compression for share links |
| Fetch API | Communication with the FastAPI backend |
| CSS | Styling (`index.css` + inline styles) |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- The [backend](https://github.com/Iamhc/Ai-pipeline-backend) running on `http://127.0.0.1:8000`

### Installation
```bash
git clone https://github.com/Iamhc/Ai-pipeline-frontend.git
cd Ai-pipeline-frontend
npm install
npm start
```
The app runs at **http://localhost:3000**.

## 📁 Project Structure

```
src/
├── nodes/
│   ├── BaseNode.js        # Shared node shell (handles, fields, styling)
│   ├── inputNode.js
│   ├── textNode.js
│   ├── llmNode.js         # Model selector + live token bar
│   ├── outputNode.js
│   ├── customNodes.js
│   └── TokenBar.js        # Live token usage bar
├── App.js
├── ui.js                  # React Flow canvas
├── toolbar.js             # Draggable node palette
├── draggableNode.js
├── submit.js              # Submit, undo/redo, share, import/export, clear
├── store.js               # Zustand store (session persist + undo history)
├── historyStore.js        # Saved pipelines (localStorage)
├── PipelineHistory.js     # Sidebar UI
└── index.css
```

## 🔌 Backend API Used

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/pipelines/parse` | Node/edge count, DAG check, token usage per LLM node |
| POST | `/models/token-usage` | Live token count for one LLM node |
| GET | `/models/token-limits` | Context window size per model |

## 📸 How It Works

1. Drag nodes from the toolbar onto the canvas.
2. Connect them: Input/Text → LLM `system`/`prompt` → Output.
3. Watch the token bar update on the LLM node as you type.
4. Click **Submit Pipeline**: the backend validates the DAG and returns token usage.
5. Open **☰ Menu** to create, switch, rename or delete pipelines.
6. Share with **🔗 Share**, or back up with **⬇ Export**.

## 🔗 Backend
👉 [Ai-pipeline-backend](https://github.com/Iamhc/Ai-pipeline-backend): FastAPI service for DAG validation and token counting.

## 👨‍💻 Author
**Himanshu Choudhary**: GitHub [@Iamhc](https://github.com/Iamhc)
