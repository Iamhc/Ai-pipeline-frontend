// inputNode.js

import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode, NodeField, NodeInput, NodeSelect, NodeTextarea } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const [value, setValue] = useState(data?.value || '');

  // Persist defaults into the store the moment this node mounts, so a node
  // that's never touched still has real data (not undefined) when the
  // pipeline is submitted.
  useEffect(() => {
    updateNodeField(id, 'inputName', currName);
    updateNodeField(id, 'inputType', inputType);
    updateNodeField(id, 'value', value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNameChange = (e) => {
    const v = e.target.value;
    setCurrName(v);
    updateNodeField(id, 'inputName', v);
  };

  const handleTypeChange = (e) => {
    const v = e.target.value;
    setInputType(v);
    updateNodeField(id, 'inputType', v);
  };

  const handleValueChange = (e) => {
    const v = e.target.value;
    setValue(v);
    updateNodeField(id, 'value', v);
  };

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="📥"
      color="#22d3ee"
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <NodeField label="Name">
        <NodeInput value={currName} onChange={handleNameChange} />
      </NodeField>
      <NodeField label="Type">
        <NodeSelect
          value={inputType}
          onChange={handleTypeChange}
          options={[{ value: 'Text', label: 'Text' }, { value: 'File', label: 'File' }]}
        />
      </NodeField>
      {inputType === 'Text' && (
        <NodeField label="Value">
          <NodeTextarea
            value={value}
            onChange={handleValueChange}
            rows={2}
            placeholder="Enter text..."
          />
        </NodeField>
      )}
    </BaseNode>
  );
};