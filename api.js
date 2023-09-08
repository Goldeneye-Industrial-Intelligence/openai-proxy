require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('OpenAI proxy is operational');
});

app.post("/stream", async (req, res) => {
  try {
    const { data } = req.body; // Your client should send data in the same format as you currently use
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    };
    
    const response = await axios.post("https://api.openai.com/v1/chat/completions", data, {
      headers,
      responseType: "stream"
    });

    response.data.pipe(res); // pipe the response stream to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/moderate", async (req, res) => {
  try {
    const { input } = req.body;
    const url = "https://api.openai.com/v1/moderations";
    const data = {
      input: input,
    };
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    };
    
    const openAIResponse = await axios.post(url, data, {
      headers,
      responseType: "stream"
    });

    openAIResponse.data.pipe(res); // pipe the response stream to the client
  } catch (error) {
    console.error("Error while moderating:", error);
    res.status(500).json({ message: "An error occurred while moderating" });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
