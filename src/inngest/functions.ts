import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI }  from "@ai-sdk/openai"
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();

export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        await step.sleep("pretend", "5s")
        const { steps: GeminiSteps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.5-flash"),
                system: "Your are a helpful assistant.",
                prompt: "What is 2+2?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )

        const { steps: OpenAiStpes } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-4"),
                system: "Your are a helpful assistant.",
                prompt: "What is 2+2?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )
        
        return {
            GeminiSteps,
            OpenAiStpes
        };
    },  
);