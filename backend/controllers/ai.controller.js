const aiService = require('../services/ai.service.js');

const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = await aiService.generateResult(prompt);
    res.json({ result });
  } catch (error) {
    console.error('Error generating result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getResult };