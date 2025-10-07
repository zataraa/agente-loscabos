import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body?.message || '';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un Asistente Jurídico Municipal de Los Cabos. Respondes con base en: 1) Bando de Policía y Buen Gobierno (2000). 2) Reglamento de Tránsito (2005). Formato: Criterio, Fundamento (Art. X), Sanción en UMAs ($113.14 MXN), Procedimiento, Notas. Sin emojis, tono oficial.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ output_text: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', servicio: 'Asistente Jurídico Los Cabos' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
