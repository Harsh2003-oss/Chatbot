const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateResult = async (prompt) => {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
    
  } catch (error) {
    console.log('AI Service Error:', error.message);
    return 'Sorry, I encountered an error processing your request.';
  }
};

module.exports = { generateResult };