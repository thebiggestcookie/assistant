import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface VaultItem {
  id: number;
  name: string;
  value: string;
}

const Vault: React.FC = () => {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    { id: 1, name: 'Credit Card', value: '**** **** **** 1234' },
    { id: 2, name: 'Social Security', value: '***-**-****' },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  const [showValues, setShowValues] = useState<{ [key: number]: boolean }>({});

  const addItem = () => {
    if (newItemName.trim() && newItemValue.trim()) {
      setVaultItems([...vaultItems, { id: Date.now(), name: newItemName, value: newItemValue }]);
      setNewItemName('');
      setNewItemValue('');
    }
  };

  const removeItem = (id: number) => {
    setVaultItems(vaultItems.filter(item => item.id !== id));
  };

  const toggleShowValue = (id: number) => {
    setShowValues({ ...showValues, [id]: !showValues[id] });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Personal Information Vault</h2>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="p-2 border rounded"
          placeholder="Item Name"
        />
        <input
          type="text"
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          className="p-2 border rounded"
          placeholder="Item Value"
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white p-2 rounded col-span-2 flex items-center justify-center"
        >
          <Plus size={20} className="mr-1" /> Add Item
        </button>
      </div>
      <ul>
        {vaultItems.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white p-4 mb-2 rounded shadow">
            <span>{item.name}</span>
            <div className="flex items-center">
              <span className="mr-2">
                {showValues[item.id] ? item.value : '*'.repeat(item.value.length)}
              </span>
              <button
                onClick={() => toggleShowValue(item.id)}
                className="mr-2 text-blue-500"
              >
                {showValues[item.id] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vault;