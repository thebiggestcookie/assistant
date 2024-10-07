import React from 'react';
import { Phone, DollarSign, Search, Mail } from 'lucide-react';

interface Task {
  id?: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  conversations: Array<{ role: 'user' | 'assistant'; content: string }>;
  actions: Array<{ type: string; description: string; cost?: number }>;
}

interface TaskDetailProps {
  task: Task;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={16} className="mr-2" />;
      case 'book':
      case 'purchase':
        return <DollarSign size={16} className="mr-2" />;
      case 'search':
        return <Search size={16} className="mr-2" />;
      case 'email':
        return <Mail size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border-t">
      <h3 className="font-semibold mb-2">Conversation:</h3>
      <div className="mb-4 max-h-60 overflow-y-auto">
        {task.conversations.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : ''}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <h3 className="font-semibold mb-2">Actions Taken:</h3>
      <ul>
        {task.actions.map((action, index) => (
          <li key={index} className="flex items-center mb-1">
            {getActionIcon(action.type)}
            <span>{action.description}</span>
            {action.cost && (
              <span className="ml-2 text-green-600 font-semibold">${action.cost.toFixed(2)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskDetail;