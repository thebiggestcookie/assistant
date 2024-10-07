import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Preference {
  id: number;
  name: string;
  value: string;
}

const Preferences: React.FC = () => {
  const [preferences, setPreferences] = useState<Preference[]>([
    { id: 1, name: 'Preferred Seat', value: 'Window' },
    { id: 2, name: 'Max Extra Spend', value: '$200' },
  ]);
  const [newPrefName, setNewPrefName] = useState('');
  const [newPrefValue, setNewPrefValue] = useState('');

  const addPreference = () => {
    if (newPrefName.trim() && newPrefValue.trim()) {
      setPreferences([...preferences, { id: Date.now(), name: newPrefName, value: newPrefValue }]);
      setNewPrefName('');
      setNewPrefValue('');
    }
  };

  const removePreference = (id: number) => {
    setPreferences(preferences.filter(pref => pref.id !== id));
  };

  const updatePreference = (id: number, newValue: string) => {
    setPreferences(preferences.map(pref => 
      pref.id === id ? { ...pref, value: newValue } : pref
    ));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Preferences</h2>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <input
          type="text"
          value={newPrefName}
          onChange={(e) => setNewPrefName(e.target.value)}
          className="p-2 border rounded"
          placeholder="Preference Name"
        />
        <input
          type="text"
          value={newPrefValue}
          onChange={(e) => setNewPrefValue(e.target.value)}
          className="p-2 border rounded"
          placeholder="Preference Value"
        />
        <button
          onClick={addPreference}
          className="bg-blue-500 text-white p-2 rounded col-span-2 flex items-center justify-center"
        >
          <Plus size={20} className="mr-1" /> Add Preference
        </button>
      </div>
      <ul>
        {preferences.map(pref => (
          <li key={pref.id} className="flex items-center justify-between bg-white p-4 mb-2 rounded shadow">
            <span>{pref.name}</span>
            <div className="flex items-center">
              <input
                type="text"
                value={pref.value}
                onChange={(e) => updatePreference(pref.id, e.target.value)}
                className="p-1 border rounded mr-2"
              />
              <button
                onClick={() => removePreference(pref.id)}
                className="text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-4 bg-green-500 text-white p-2 rounded flex items-center">
        <Save size={20} className="mr-1" /> Save Preferences
      </button>
    </div>
  );
};

export default Preferences;