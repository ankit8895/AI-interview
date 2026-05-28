import axios from "axios";
import { ENV } from "../config/env.js";

export const askAI = async (messages) => {
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0)
      throw new Error("Messages array is empty");

    const response = await axios.post(
      ENV.OPENROUTER_API,
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim())
      throw new Error("AI returned empty response.");

    return content;
  } catch (error) {
    const status = error?.response?.status;
    console.error(
      "[OpenRouter]",
      status,
      error?.response?.data || error?.message,
    );

    const err = new Error("OpenRouter API Error");
    err.statusCode = status === 429 ? 429 : 502;
    err.cause = error;
    throw err;
  }
};
