import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { frames, exerciseType = "General Fitness" } = await req.json();

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: "No frame data provided for analysis." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const systemInstruction = `You are an expert fitness trainer specializing in biomechanics and posture analysis.
You will receive serialized MediaPipe Pose Landmark data (3D skeletal coordinates normalized to [0.0, 1.0]) for an exercise session.
The user is performing: ${exerciseType}.
Analyze the sampled frames for form, balance, and alignment.
Identify any deviations from the ideal form (e.g., knee caving, rounded shoulders, uneven hips).
Provide the response strictly as a JSON object. All text values MUST be in natural, professional Korean.
Use the following JSON schema:
{
  "score": <number between 0 and 100>,
  "overall_feedback": "<brief overall assessment in Korean>",
  "posture_details": [
    {
      "part": "<affected body part in Korean, e.g., 무릎, 허리, 어깨>",
      "issue": "<what was wrong in Korean>",
      "correction": "<how to fix it in Korean>"
    }
  ]
}
Do not include markdown blocks like \`\`\`json. Return bare JSON.`;

    const prompt = `Here are the sampled frames of pose landmarks (each frame contains 33 x,y,z coordinates):\n\n${JSON.stringify(frames.slice(0, 5))}`; // Limit to 5 frames to save tokens

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2, // Low temp for more clinical/analytical response
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
        throw new Error("No response from AI model.");
    }
    const parsedData = JSON.parse(textResponse);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing posture:', error);
    return NextResponse.json(
      { error: "Failed to analyze posture data.", details: error.message },
      { status: 500 }
    );
  }
}
