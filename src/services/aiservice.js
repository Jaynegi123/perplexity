import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatMistralAI } from '@langchain/mistralai';

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.6-flash",
    apiKey: process.env.geminiapi
});

const mistralaimodel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.mistralsapi
});

export async function generateresponse(message) {
    try {
        const response = await model.invoke(
            message.map(msg => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content);
                }

                if (msg.role === "ai") {
                    return new AIMessage(msg.content);
                }
            })
        );

        return response.content;

    } catch (error) {
        if (
            error.status === 429
        ) {
            console.error("Gemini API rate limit exceeded (429).");

            throw new Error(
                "AI service rate limit reached (429). Please wait 1 minute and try again."
            );
        }

        console.error("Error generating AI response:", error);
        throw error;
    }
}

export async function generatetitle(message) {
    try {
        const response = await mistralaimodel.invoke([
            new SystemMessage(`you are assistant that generate consise and descriptive titles for chat conversation.
        user will provide you with the first message of chat conversation and u will generate the title that capture the essance of conversation 2-3 words the title should be clear,relevent and engaging  giving user the quich understainding of the chat topic`),
            new HumanMessage(`Generate a title for a chat conversation based on following message:${message}`)
        ]);

        return response.content;
    } catch (error) {
        console.warn("Mistral API title generation failed (rate limited or error). Using local title generator to preserve Gemini API quota.");
        return createLocalTitle(message);
    }
}

export default generateresponse;