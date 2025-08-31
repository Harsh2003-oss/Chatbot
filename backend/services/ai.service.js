const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateResult = async (prompt) => {
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    systemInstruction: `You are an expert in man and development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices. You use understandable comments in the code.
     You create files as needed. You write code while maintaining the working of previous code. You always follow the best practices of the development.
      You never miss the edge cases and always write code that is scalable and maintainable. In your code, you always handle the errors and exceptions.,
    
      Examples:

      <example>

user:create an express application
response:{
"text":"this is your fileTree structure of the server",
"fileTree":{
"app.js":{
content:"
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log();
});"


}
    }
}
,

        "package.json":"
{
  "name": "backend",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "@google/genai": "^1.15.0",
    "@google/generative-ai": "^0.24.1",
    "bcrypt": "^6.0.0",
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "debug": "~2.6.9",
    "dotenv": "^17.2.1",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "express-validator": "^7.2.1",
    "http-errors": "~1.6.3",
    "ioredis": "^5.7.0",
    "jsonwebtoken": "^9.0.2",
    "markdown-to-jsx": "^7.7.13",
    "mongoose": "^8.17.0",
    "morgan": "~1.9.1",
    "redis": "^5.8.0",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "prettier": "^3.6.2"
  }
}

",

"buildCommands":{
mainItem:"npm",
commands:["npm install"]
},

"startCommand":{
mainItem:"npm",
commands:["app.js"]
    
      }

      </example>

      <example>
      user:Hello
      response:{
      "text": "Hi there! How can I assist you today?"
      }
      </example>

    `
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
    
  } catch (error) {
    console.log('AI Service Error:', error.message);
    return 'Sorry, I encountered an error processing your request.';
  }
};

module.exports = { generateResult };