import { inngest } from '@/inngest/client';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { workflowRouter } from '@/features/workflows/server/routers';

export const appRouter = createTRPCRouter({
    workflow: workflowRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;