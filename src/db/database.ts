import Dexie, { Table } from 'dexie';

export interface Task {
  id?: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  conversations: Array<{ role: 'user' | 'assistant'; content: string }>;
  actions: Array<{ type: string; description: string; cost?: number }>;
}

export interface VaultItem {
  id?: number;
  name: string;
  value: string;
}

export interface Preference {
  id?: number;
  name: string;
  value: string;
}

export interface APIKey {
  key: string;
  value: string;
}

export class AppDatabase extends Dexie {
  tasks!: Table<Task>;
  vaultItems!: Table<VaultItem>;
  preferences!: Table<Preference>;
  apiKeys!: Table<APIKey>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      tasks: '++id, description, status',
      vaultItems: '++id, name',
      preferences: '++id, name'
    });
    this.version(2).stores({
      apiKeys: 'key'
    }).upgrade(tx => {
      return tx.apiKeys.bulkAdd([
        { key: 'openai', value: '' },
        { key: 'twilio_account_sid', value: '' },
        { key: 'twilio_auth_token', value: '' },
        { key: 'twilio_phone_number', value: '' },
        { key: 'ai_prompt', value: 'You are a helpful personal assistant. Ask clarifying questions about tasks to gather more information.' }
      ]);
    });
  }

  async initializeData() {
    const taskCount = await this.tasks.count();
    if (taskCount === 0) {
      await this.tasks.bulkAdd([
        { description: 'Example Task 1', status: 'pending', conversations: [], actions: [] },
        { description: 'Example Task 2', status: 'in_progress', conversations: [], actions: [] }
      ]);
    }
  }
}

export const db = new AppDatabase();

// Initialize the database
db.initializeData().catch(error => {
  console.error('Failed to initialize database:', error);
});