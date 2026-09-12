import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.7-flash",
    apiKey: process.env.geminiapi
});

export async function testAi() {
    try {
        const response = await model.invoke(
            "What is the capital of India?"
        );

        console.log(response.content);
    } catch (error) {
        console.log(error);
    }
}