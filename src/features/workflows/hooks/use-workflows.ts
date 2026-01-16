"use client";

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowParams } from "./use-workflows-params";


export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowParams();
    return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflow.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" Created`)
                queryClient.invalidateQueries(
                    trpc.workflow.getMany.queryOptions({})
                )
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`)
            }
        })
    )
}

export const useRemoveWorkflow = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    
    return useMutation(
        trpc.workflow.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" Removed`)
                queryClient.invalidateQueries(
                    trpc.workflow.getMany.queryOptions({}) // Invalidating all rather than specific State
                )
                // Can also do this - see more
                // queryClient.invalidateQueries(
                //     trpc.workflows.getOne.queryFilter({id: data.id})
                // )
            },
            onError: (error) => {
                toast.error(`Failed to remove workflow: ${error.message}`)
            }
        })
    )
}