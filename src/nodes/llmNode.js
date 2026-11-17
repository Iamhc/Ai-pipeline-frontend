// llmNode.js

import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode, NodeField, NodeSelect } from './BaseNode';
import { TokenBar } from './TokenBar';

const MODEL_OPTIONS = [
  { value: 'GPT-4o', label: 'GPT-4o' },
  { value: 'GPT-4 Turbo', label: 'GPT-4 Turbo' },
  { value: 'GPT-3.5 Turbo', label: 'GPT-3.5 Turbo' },
  { value: 'Claude 3.5 Sonnet', label: 'Claude 3.5 Sonnet' },
];

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [model, setModel] = useState(data?.model || 'GPT-4o');

  // Persist the default model into the store on mount so it's never
  // undefined when the pipeline is submitted.
  useEffect(() => {
    updateNodeField(id, 'model', model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModelChange = (e) => {
    const v = e.target.value;
    setModel(v);
    updateNodeField(id, 'model', v);
  };

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="🧠"
      color="#c084fc"
      inputs={[{ id: 'system', label: 'system' }, { id: 'prompt', label: 'prompt' }]}
      outputs={[{ id: 'response', label: 'response' }]}
    >
      <NodeField label="Model">
        <NodeSelect value={model} onChange={handleModelChange} options={MODEL_OPTIONS} />
      </NodeField>
      <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
        Connect system prompt + user prompt
      </div>
      <TokenBar id={id} />
    </BaseNode>
  );
};