import React, { useState, useEffect } from 'react';
import { Phone, Eye, Play } from 'lucide-react';
import { db } from '../db/database';

const TestCall: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [prompt, setPrompt] = useState('You are a helpful AI assistant. Engage in a friendly conversation with the caller and try to assist them with any questions or tasks they might have.');
  const [apiKeys, setApiKeys] = useState({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    openaiApiKey: '',
  });

  useEffect(() => {
    const loadAPIKeys = async () => {
      const twilioAccountSid = await db.apiKeys.get('twilio_account_sid');
      const twilioAuthToken = await db.apiKeys.get('twilio_auth_token');
      const twilioPhoneNumber = await db.apiKeys.get('twilio_phone_number');
      const openaiApiKey = await db.apiKeys.get('openai');
      setApiKeys({
        twilioAccountSid: twilioAccountSid?.value || '',
        twilioAuthToken: twilioAuthToken?.value || '',
        twilioPhoneNumber: twilioPhoneNumber?.value || '',
        openaiApiKey: openaiApiKey?.value || '',
      });
    };
    loadAPIKeys();
  }, []);

  const initiateCall = async (to: string) => {
    setCallStatus('Initiating call...');
    setErrorDetails('');
    setAIResponse('');
    try {
      const response = await fetch('/api/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCallStatus(`Call initiated successfully. SID: ${data.callSid}`);
      setAIResponse(`AI Response: ${data.aiResponse}`);
    } catch (error) {
      setCallStatus('Error occurred during call');
      setErrorDetails(error.message);
    }
  };

  const showAPIKeys = () => {
    alert('API Keys logged to console');
    console.log('Current API Keys:', apiKeys);
  };

  const testCall = () => {
    initiateCall('+14158440885');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Test Call</h2>
      <div className="mb-4">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="p-2 border rounded mr-2"
          placeholder="Enter phone number"
        />
        <button
          onClick={() => initiateCall(phoneNumber)}
          className="bg-blue-500 text-white p-2 rounded flex items-center mr-2"
        >
          <Phone size={20} className="mr-1" /> Initiate Call
        </button>
        <button
          onClick={testCall}
          className="bg-green-500 text-white p-2 rounded flex items-center mr-2"
        >
          <Play size={20} className="mr-1" /> Test Call
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="prompt" className="block mb-2">AI Prompt:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>
      <button
        onClick={showAPIKeys}
        className="bg-gray-500 text-white p-2 rounded flex items-center mb-4"
      >
        <Eye size={20} className="mr-1" /> Show API Keys (Console)
      </button>
      {callStatus && (
        <div className="mt-4">
          <p className="font-bold">{callStatus}</p>
          {errorDetails && <p className="text-red-500">{errorDetails}</p>}
          {aiResponse && <p className="mt-2">{aiResponse}</p>}
        </div>
      )}
    </div>
  );
};

export default TestCall;