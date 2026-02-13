import type { NodeExecutor } from "@/features/executions/types";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString); // to hadle the quot$ problem

    return safeString;
});

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
}

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    )

    // This works here because step.ai.wrap doesnt open a different scope whereas step.run did.

    if(!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Slack node: Message content is missing.");
    }
    
    const rawContent = Handlebars.compile(data.content)(context); // The way Handlebars handle this will make the data incompatible with telegram.
    const content = decode(rawContent);

    try {
        
        const result = await step.run("discord-webhook", async () => {
            if(!data.webhookUrl) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    })
                )
                throw new NonRetriableError("Slack node: Webhook URL is missing.");
            }

            await ky.post(data.webhookUrl, {
                json: {
                    content: content, // The key depends on the workflow config.
                }
            });

            if(!data.variableName) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    })
                )
                throw new NonRetriableError("Slack node: Variable Name is missing.");
            }

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                },
            };
        })
        
        await publish(
            slackChannel().status({
                nodeId,
                status: "success",
            }),
        );
        
        return result;

    } catch(error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw error;
    }
};