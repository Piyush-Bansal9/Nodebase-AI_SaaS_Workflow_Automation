"use client";

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflow.getMany.queryOptions())
}

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflow.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" Created`)
                queryClient.invalidateQueries(
                    trpc.workflow.getMany.queryOptions()
                )
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`)
            }
        })
    )
}