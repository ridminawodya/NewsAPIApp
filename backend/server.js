const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// News API endpoint
app.get('/api/news', async (req, res) => {
  try {
    const { keyword, date, language } = req.query;
    
    const apiKey = process.env.NEWS_API_KEY;
    const baseUrl = process.env.NEWS_API_ENDPOINT || 'https://newsapi.org/v2/everything';
    
    const params = {
      apiKey: apiKey,
      q: keyword || 'breaking',
      language: language || 'en',
      page: req.query.page || 1,  
      pageSize: req.query.pageSize || 20,
      sortBy: 'publishedAt'
    };

    // Add date filter if provided
    if (date) {
      params.from = date;
      params.to = date;
    }

    console.log('Fetching news with params:', params);

    const response = await axios.get(baseUrl, { params });
    
    res.json({
      success: true,
      articles: response.data.articles || [],
      totalResults: response.data.totalResults || 0
    });

  } catch (error) {
    console.error('Error fetching news:', error.message);
    console.error('Error details:', error.response?.data);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.response?.data?.message || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});