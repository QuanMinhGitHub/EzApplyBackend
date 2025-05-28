import { chats } from './inputs.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function formatGenAIResponse(text) {
    const pattern = chats.formatPattern;
    const match = text.match(pattern);
    const json = match ? match[1] : text;
    return JSON.parse(json);
}

export async function chatWithGemini(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: chats.model });
        const chat = model.startChat({
            history: [],
        });
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();
        return text;

    } catch (error) {
        console.log('Error in the chatWithGemini function', error);
    }
}

export function extractLabelsForMapping(fields) {
    const set = new Set();
    for (const field of fields) {
        let value = field.groupLabel != null ? field.groupLabel : field.label != null ? field.label : null;
        if (value) set.add(value);
    }
    return Array.from(set);
}