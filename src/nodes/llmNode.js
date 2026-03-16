// llmNode.js

import { useState } from 'react';
import { BaseNode, NodeField, NodeSelect } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="🧠"
      color="#a78bfa"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
    >
      <NodeField label="Model">
        <NodeSelect
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={[
            { value: 'gpt-4o', label: 'GPT-4o' },
            { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
            { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
          ]}
        />
      </NodeField>
      <div style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
        Connect system prompt + user prompt
      </div>
    </BaseNode>
  );
};
