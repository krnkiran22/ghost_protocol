const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { 
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Pinata upload function
async function uploadToPinata(file: any): Promise<any> {
  try {
    const FormData = require('form-data');
    const axios = require('axios');
    
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname || file.name);
    
    const pinataMetadata = JSON.stringify({
      name: file.originalname || file.name,
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_SECRET_KEY,
        },
      }
    );
    
    return {
      ipfsHash: response.data.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      timestamp: response.data.Timestamp,
    };
  } catch (error: any) {
    console.error('Pinata upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS: ' + (error.response?.data?.error || error.message));
  }
}

// Groq AI analysis function
async function analyzeContentWithGroq(textContent: string): Promise<any> {
  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `Analyze this creative work and extract metadata in JSON format:

${textContent.substring(0, 3000)}

Return ONLY a JSON object with these exact fields:
{
  "title": "extracted or inferred title",
  "publicationYear": year as number or null,
  "genre": "genre classification",
  "description": "2-3 sentence description",
  "detectedInfluences": ["influence1", "influence2"]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1000,
    });
    
    const responseText = chatCompletion.choices[0]?.message?.content || '{}';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    
    return {
      success: true,
      data: {
        title: analysisData.title || 'Untitled',
        publicationYear: analysisData.publicationYear || null,
        genre: analysisData.genre || 'Unknown',
        description: analysisData.description || 'No description available.',
        detectedInfluences: Array.isArray(analysisData.detectedInfluences) 
          ? analysisData.detectedInfluences 
          : [],
      },
    };
  } catch (error: any) {
    console.error('Groq analysis error:', error.message);
    return {
      success: false,
      error: error.message,
      data: {
        title: 'Untitled',
        publicationYear: null,
        genre: 'Unknown',
        description: 'AI analysis failed. Please enter details manually.',
        detectedInfluences: [],
      },
    };
  }
}

// Extract text from different file types
async function extractTextFromFile(file: any): Promise<string> {
  const buffer = file.buffer;

  try {
    // PDF files
    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      return pdfData.text;
    }

    // DOCX files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Plain text files
    if (file.mimetype === 'text/plain') {
      return buffer.toString('utf-8');
    }

    // For images, audio, video - return metadata only
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('audio/') ||
      file.mimetype.startsWith('video/')
    ) {
      return `File name: ${file.originalname}\nFile type: ${file.mimetype}\nFile size: ${file.size} bytes\n\nNote: This is a ${file.mimetype.split('/')[0]} file. Please enter details manually.`;
    }

    throw new Error('Unsupported file type for text extraction');
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
}

// Upload to IPFS endpoint
app.post('/api/upload-to-ipfs', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file size (already handled by multer, but double-check)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return res.status(400).json({ error: 'File size exceeds 100MB limit' });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/epub+zip',
      'image/jpeg',
      'image/png',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'File type not supported' });
    }

    // Convert buffer to File-like object for Pinata
    const fileForUpload = {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      arrayBuffer: async () => file.buffer.buffer.slice(file.buffer.byteOffset, file.buffer.byteOffset + file.buffer.byteLength)
    } as File;

    // Upload to Pinata
    const result = await uploadToPinata(fileForUpload);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        ipfsHash: result.ipfsHash,
        ipfsUrl: result.ipfsUrl,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        timestamp: result.timestamp,
      },
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload file'
    });
  }
});

// Analyze content endpoint
app.post('/api/analyze-content', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file;
    const ipfsHash = req.body.ipfsHash;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Extract text content
    let textContent: string;
    try {
      textContent = await extractTextFromFile(file);
    } catch (extractError: any) {
      // If text extraction fails, return basic metadata
      return res.json({
        success: true,
        message: 'Text extraction not available for this file type',
        data: {
          title: file.originalname.replace(/\.[^/.]+$/, ''), // Remove extension
          publicationYear: null,
          genre: 'Unknown',
          description: 'Please enter description manually.',
          detectedInfluences: [],
          extractionFailed: true,
        },
      });
    }

    // Analyze with Groq AI
    const analysisResult = await analyzeContentWithGroq(textContent);

    res.json({
      success: analysisResult.success,
      message: analysisResult.success
        ? 'Content analyzed successfully'
        : 'Analysis completed with errors',
      data: {
        ...analysisResult.data,
        ipfsHash: ipfsHash,
        fileName: file.originalname,
        textPreview: textContent.substring(0, 500), // First 500 chars
      },
      aiError: analysisResult.error || null,
    });
  } catch (error: any) {
    console.error('Analysis API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze content',
      data: {
        title: 'Untitled',
        publicationYear: null,
        genre: 'Unknown',
        description: 'Analysis failed. Please enter details manually.',
        detectedInfluences: [],
      },
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'OK', message: 'Ghost Protocol API Server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Ghost Protocol API Server running on port ${port}`);
  console.log(`📁 Upload endpoint: http://localhost:${port}/api/upload-to-ipfs`);
  console.log(`🤖 Analysis endpoint: http://localhost:${port}/api/analyze-content`);
});