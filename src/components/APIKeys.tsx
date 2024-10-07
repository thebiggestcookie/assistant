import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { db } from '../db/database';

const APIKeys: React.FC = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('');
  const [aiPrompt, setAIPrompt] = useState('');
  const [showKeys, setShowKeys] = useState({
    openAI: false,
    twilioAccountSid: false,
    twilioAuthToken: false,
  });

  useEffect(() => {
    const loadAPIKeys = async () => {
      const openAIKeyData = await db.apiKeys.get('openai');
      const twilioAccountSidData = await db.apiKeys.get('twilio_account_sid');
      const twilioAuthTokenData = await db.apiKeys.get('twilio_auth_token');
      const twilioPhoneNumberData = await db.apiKeys.get('twilio_phone_number');
      const aiPromptData = await db.apiKeys.get('ai_prompt');

      setOpenAIKey(openAIKeyData?.value || '');
      setTwilioAccountSid(twilioAccountSidData?.value || '');
      setTwilioAuthToken(twilioAuthTokenData?.value || '');
      setTwilioPhoneNumber(twilioPhoneNumberData?.value || '');
      setAIPrompt(aiPromptData?.value || '');
    };

    loadAPIKeys();
  }, []);

  const saveAPIKeys = async () => {
    await db.apiKeys.put({ key: 'openai', value: openAIKey });
    await db.apiKeys.put({ key: 'twilio_account_sid', value: twilioAccountSid });
    await db.apiKeys.put({ key: 'twilio_auth_token', value: twilioAuthToken });
    await db.apiKeys.put({ key: 'twilio_phone_number', value: twilioPhoneNumber });
    await db.apiKeys.put({ key: 'ai_prompt', value: aiPrompt });
    
    alert('API keys and AI prompt saved successfully!');
  };

  const toggleShowKey = (key: 'openAI' | 'twilioAccountSid' | 'twilioAuthToken') => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">API Keys</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">OpenAI API Key:</label>
          <div className="flex">
            <input
              type={showKeys.openAI ? 'text' : 'password'}
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button
              onClick={() => toggleShowKey('openAI')}
              className="bg-gray-200 p-2 rounded-r"
            >
              {showKeys.openAI ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block mb-1">Twilio Account SID:</label>
          <div className="flex">
            <input
              type={showKeys.twilioAccountSid ? 'text' : 'password'}
              value={twilioAccountSid}
              onChange={(e) => setTwilioAccountSid(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button
              onClick={() => toggleShowKey('twilioAccountSid')}
              className="bg-gray-200 p-2 rounded-r"
            >
              {showKeys.twilioAccountSid ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block mb-1">Twilio Auth Token:</label>
          <div className="flex">
            <input
              type={showKeys.twilioAuthToken ? 'text' : 'password'}
              value={twilioAuthToken}
              onChange={(e) => setTwilioAuthToken(e.target.value)}
              className="flex-grow p-2 border rounded-l"
            />
            <button
              onClick={() => toggleShowKey('twilioAuthToken')}
              className="bg-gray-200 p-2 rounded-r"
            >
              {showKeys.twilioAuthToken ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block mb-1">Twilio Phone Number:</label>
          <input
            type="text"
            value={twilioPhoneNumber}
            onChange={(e) => setTwilioPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">AI Prompt:</label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAIPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <button
          onClick={saveAPIKeys}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Save size={20} className="mr-1" /> Save API Keys
        </button>
      </div>
    </div>
  );
};

export default APIKeys;