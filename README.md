# 🧩 AI Pipeline Builder — Frontend

A visual, drag-and-drop no-code workflow editor built with React.js, TypeScript, and ReactFlow. Design complex AI pipelines through an intuitive node-based interface — no code required.

![Tech Stack](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- 🖱️ **Drag-and-drop** node-based pipeline editor using ReactFlow
- 🔄 **Real-time DAG validation** — prevents invalid connections and infinite loops
- 🧠 **Multiple node types** — LLM, Input, Output, Text nodes
- 📦 **Zustand state management** — clean, scalable global state
- 🔗 **REST API integration** — connects seamlessly with FastAPI backend
- 📱 **Responsive UI** — works across screen sizes
- ⚡ **Optimized rendering** — smooth performance with large pipelines

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | UI framework |
| TypeScript | Type safety |
| ReactFlow | Node-based pipeline editor |
| Zustand | State management |
| Tailwind CSS | Styling |
| Axios | API communication |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/Iamhc/Ai-pipeline-frontend.git

# Navigate to project
cd Ai-pipeline-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:3000`

---

## 🔧 Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── nodes/          # Custom node types (LLM, Input, Output, Text)
│   ├── toolbar/        # Node toolbar and controls
│   └── ui/             # Reusable UI components
├── store/
│   └── pipelineStore.ts  # Zustand global state
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
└── pages/              # Next.js pages
```

---

## 🔗 Backend

This frontend connects to the FastAPI backend:
👉 [Ai-pipeline-backend](https://github.com/Iamhc/Ai-pipeline-backend)

---

## 📸 Demo

> Drag nodes from the toolbar → Connect them → Submit pipeline → Backend validates DAG in real-time

---

## 👨‍💻 Author

**Himanshu Choudhary**
- GitHub: [@Iamhc](https://github.com/Iamhc)
- LinkedIn: [himanshu-choudhary](https://linkedin.com/in/himanshu-choudhary)
