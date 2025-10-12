import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Analyze content using Groq LLaMA
export async function analyzeContentWithGroq(textContent: string) {
  try {
    const prompt = `You are an expert literary and IP analyst. Analyze the following creative work and extract structured information.

CONTENT TO ANALYZE:
${textContent.substring(0, 8000)} 

INSTRUCTIONS:
1. Identify the title of this work
2. Estimate the publication year (or indicate if modern/contemporary)
3. Determine the genre/category
4. Write a concise 200-word description
5. Detect any clear influences from other well-known works (books, films, art, music)
6. For each influence, estimate similarity confidence (0-100%)

RETURN ONLY VALID JSON in this exact format:
{
  "title": "string",
  "publicationYear": number or null,
  "genre": "string",
  "description": "string (max 200 words)",
  "detectedInfluences": [
    {
      "name": "string (work title)",
      "creator": "string (author/artist name)",
      "year": number or null,
      "confidence": number (0-100)
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no explanatory text before or after.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    // Extract the response content
    const aiResponse = response.data.choices[0].message.content;

    // Parse JSON from response
    let parsedData;
    try {
      // Try to extract JSON from response (in case AI adds extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('AI returned invalid JSON format');
    }

    // Validate required fields
    if (!parsedData.title || !parsedData.genre || !parsedData.description) {
      throw new Error('Missing required fields in AI response');
    }

    return {
      success: true,
      data: {
        title: parsedData.title,
        publicationYear: parsedData.publicationYear || null,
        genre: parsedData.genre,
        description: parsedData.description,
        detectedInfluences: parsedData.detectedInfluences || [],
      },
    };
  } catch (error: any) {
    console.error('Groq AI analysis error:', error);
    
    // Return fallback data if AI fails
    return {
      success: false,
      error: error.message,
      data: {
        title: 'Untitled Work',
        publicationYear: null,
        genre: 'Unknown',
        description: 'AI analysis unavailable. Please enter details manually.',
        detectedInfluences: [],
      },
    };
  }
}