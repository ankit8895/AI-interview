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
    console.error("OpenRouter Error:", error?.response?.data || error?.message);
    throw new Error("OpenRouter API Error");
  }
};
