import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import twilio from 'twilio';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json());
app.use(express.static('dist'));

app.post('/api/initiate-call', async (req, res) => {
  try {
    const { to, prompt } = req.body;
    
    // Initiate a call using Twilio
    const call = await twilioClient.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your TwiML URL
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    // Use OpenAI to generate a response based on the prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
    });

    res.json({ 
      callSid: call.sid,
      aiResponse: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));