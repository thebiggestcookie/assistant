import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Send, MessageSquare } from 'lucide-react';
import TaskDetail from './TaskDetail';
import { db, Task } from '../db/database';
import { useLiveQuery } from 'dexie-react-hooks';

const TaskList: React.FC = () => {
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const [newTask, setNewTask] = useState('');
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [userResponse, setUserResponse] = useState('');

  const addTask = async () => {
    if (newTask.trim()) {
      const task = {
        description: newTask,
        status: 'pending' as const,
        conversations: [],
        actions: []
      };
      const id = await db.tasks.add(task);
      setNewTask('');
      setExpandedTask(id);
      processTaskWithAI(task as Task);
    }
  };

  const removeTask = async (id: number) => {
    await db.tasks.delete(id);
  };

  const toggleTaskExpansion = (id: number) => {
    setExpandedTask(expandedTask === id ? null : id);
    setUserResponse('');
  };

  const updateTaskStatus = async (id: number, newStatus: 'pending' | 'in_progress' | 'completed') => {
    await db.tasks.update(id, { status: newStatus });
  };

  const processTaskWithAI = async (task: Task) => {
    try {
      const openAIKey = await db.apiKeys.get('openai');
      const aiPrompt = await db.apiKeys.get('ai_prompt');
      if (!openAIKey || !openAIKey.value) {
        console.log('OpenAI API key not set');
        return;
      }
      if (!aiPrompt || !aiPrompt.value) {
        console.log('AI prompt not set');
        return;
      }

      // Here you would typically make an API call to OpenAI
      // For demonstration, we'll just add a mock AI response
      const aiResponse = "I understand you want to " + task.description + ". Can you provide more details about when you need this done?";
      
      const updatedConversations = [...task.conversations, 
        { role: 'assistant' as const, content: aiResponse }
      ];

      await db.tasks.update(task.id!, { conversations: updatedConversations });
    } catch (error) {
      console.error('Error processing task with AI:', error);
    }
  };

  const sendUserResponse = async (taskId: number) => {
    if (userResponse.trim()) {
      const task = await db.tasks.get(taskId);
      if (task) {
        const updatedConversations = [...task.conversations, 
          { role: 'user' as const, content: userResponse }
        ];
        await db.tasks.update(taskId, { conversations: updatedConversations });
        setUserResponse('');
        
        // Process the user's response with AI
        await processTaskWithAI({...task, conversations: updatedConversations});
      }
    }
  };

  const sendTextMessage = async (taskId: number) => {
    try {
      const twilioKey = await db.apiKeys.get('twilio_auth_token');
      if (!twilioKey || !twilioKey.value) {
        console.log('Twilio API key not set');
        return;
      }

      // Here you would typically make an API call to Twilio
      // For demonstration, we'll just log a message
      console.log(`Sending text message for task ${taskId}`);
    } catch (error) {
      console.error('Error sending text message:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Add a new task"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded-r flex items-center"
        >
          <Plus size={20} className="mr-1" /> Add
        </button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="bg-white mb-2 rounded shadow">
            <div className="flex items-center justify-between p-4">
              <span className={task.status === 'completed' ? 'line-through' : ''}>
                {task.description}
              </span>
              <div className="flex items-center">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id!, e.target.value as 'pending' | 'in_progress' | 'completed')}
                  className="mr-2 p-1 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => toggleTaskExpansion(task.id!)}
                  className="mr-2 text-blue-500"
                >
                  {expandedTask === task.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <button
                  onClick={() => sendTextMessage(task.id!)}
                  className="mr-2 text-green-500"
                >
                  <MessageSquare size={20} />
                </button>
                <button
                  onClick={() => removeTask(task.id!)}
                  className="text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            {expandedTask === task.id && (
              <div className="p-4 border-t">
                <TaskDetail task={task} />
                <div className="mt-4">
                  <div className="mb-2 max-h-40 overflow-y-auto">
                    {task.conversations.map((message, index) => (
                      <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          {message.content}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="flex-grow p-2 border rounded-l"
                      placeholder="Your response..."
                    />
                    <button
                      onClick={() => sendUserResponse(task.id!)}
                      className="bg-green-500 text-white p-2 rounded-r flex items-center"
                    >
                      <Send size={20} className="mr-1" /> Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;