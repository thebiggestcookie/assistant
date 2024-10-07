import React, { useState } from 'react';
import TaskList from './components/TaskList';
import Vault from './components/Vault';
import Preferences from './components/Preferences';
import Dashboard from './components/Dashboard';
import APIKeys from './components/APIKeys';
import TestCall from './components/TestCall';
import { Brain, Lock, Settings, LayoutDashboard, Key, Phone } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Personal Assistant</h1>
      </header>
      <div className="flex flex-1">
        <nav className="bg-gray-800 text-white w-64 p-4">
          <ul>
            {[
              { id: 'tasks', icon: Brain, label: 'Tasks' },
              { id: 'vault', icon: Lock, label: 'Vault' },
              { id: 'preferences', icon: Settings, label: 'Preferences' },
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'apikeys', icon: Key, label: 'API Keys' },
              { id: 'testcall', icon: Phone, label: 'Test Call' },
            ].map(({ id, icon: Icon, label }) => (
              <li key={id} className={`mb-2 ${activeTab === id ? 'bg-gray-700' : ''}`}>
                <button
                  className="flex items-center w-full p-2 rounded"
                  onClick={() => setActiveTab(id)}
                >
                  <Icon className="mr-2" size={20} /> {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 p-8">
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'vault' && <Vault />}
          {activeTab === 'preferences' && <Preferences />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'apikeys' && <APIKeys />}
          {activeTab === 'testcall' && <TestCall />}
        </main>
      </div>
    </div>
  );
}

export default App;