// Vercel serverless endpoint. Configure GEMINI_API_KEY and OPENAI_API_KEY as server env vars.
// Frontend sends { provider, topic, mode, question, syllabusCite }.
export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { provider = 'gemini', topic = '', mode = 'beginner', question = '', syllabusCite = '' } = req.body || {};
  if (typeof question !== 'string' || !question.trim() || question.length > 6000) return res.status(400).json({ error: 'A valid question (max 6000 characters) is required.' });
  const systemPrompt = `You are a careful BCA personal teacher. Teach in simple Hinglish with an exam-ready English definition, step-by-step explanation, one real-life example, and a short recall question. Follow the supplied syllabus context; do not invent page citations. Topic: ${String(topic).slice(0,300)}. Mode: ${String(mode).slice(0,40)}. Source reference: ${String(syllabusCite).slice(0,300)}.`;
  try {
    if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: question }], temperature: 0.4 })
      });
      const data: any = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'OpenAI request failed.' });
      return res.status(200).json({ reply: data.choices?.[0]?.message?.content || '', provider: 'openai' });
    }
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nStudent question: ${question}` }] }] })
    });
    const data: any = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'Gemini request failed.' });
    return res.status(200).json({ reply: data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '', provider: 'gemini' });
  } catch {
    return res.status(502).json({ error: 'AI provider unavailable. Check server configuration and internet connection.' });
  }
}
