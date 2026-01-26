"use client";

import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
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

export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflow.getOne.queryOptions({ id }))
}

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.workflow.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" updated`)
                queryClient.invalidateQueries(
                    trpc.workflow.getMany.queryOptions({})
                )
                queryClient.invalidateQueries(
                    trpc.workflow.getOne.queryOptions({ id: data.id })
                )
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`)
            }
        })
    )
}

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflow.update.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" saved.`)
                queryClient.invalidateQueries(
                    trpc.workflow.getMany.queryOptions({})
                )
                queryClient.invalidateQueries(
                    trpc.workflow.getOne.queryOptions({ id: data.id })
                )
            },
            onError: (error) => {
                toast.error(`Failed to save workflow: ${error.message}`);
            }
        })
    )
}


export const useExecuteWorkflow = () => {
    const trpc = useTRPC();

    return useMutation(
        trpc.workflow.execute.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" executed.`)
                
            },
            onError: (error) => {
                toast.error(`Failed to execute workflow: ${error.message}`);
            }
        })
    )
}