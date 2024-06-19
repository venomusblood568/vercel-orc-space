const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OCR_API_KEY = 'K89996003288957'; // Replace with your OCR.space API key

// Middleware for handling CORS
app.use(cors());

// Multer middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// OCR endpoint
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const image = req.file;

    // Prepare form data for OCR.space API
    const formData = new FormData();
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'true');
    formData.append('file', fs.createReadStream(image.path), {
      contentType: image.mimetype,
      filename: image.originalname,
    });

    // Make POST request to OCR.space API
    const ocrResponse = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Log the entire OCR response for debugging
    console.log('OCR Response:', ocrResponse.data);

    // Send the entire OCR response back to the client
    res.json(ocrResponse.data);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
