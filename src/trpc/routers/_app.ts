import { inngest } from '@/inngest/client';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { workflowRouter } from '@/features/workflows/server/routers';
import { credentialsRouter } from '@/features/credentials/server/routers';
import { executionsRouter } from '@/features/executions/server/routers';

export const appRouter = createTRPCRouter({
    workflow: workflowRouter,
    credentials: credentialsRouter,
    executions: executionsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;