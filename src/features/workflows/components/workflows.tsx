"use client";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useWorkflowParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowParams();
    const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams
    })
    return (
        <EntitySearch 
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search WorkFlows"
        />
    )
}

export const WorkflowsList = () => {

    const workflows = useSuspenseWorkflows();

    return (
        <EntityList
            items = {workflows.data.items}
            getKey = {(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow}/>}
            emptyView = {<WorkflowsEmpty/>}
        />
    )
}

export const WorkflowsHeader = ({disabled}: {disabled?: boolean}) => {
    const router = useRouter()    
    const createWorkflow = useCreateWorkflow()
    const { handleError, modal } = useUpgradeModal()

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error)
            }
        })
    }
    return (
    <>
        {modal}
        <EntityHeader 
            title="Workflows"
            description="Create and manage your workflows"
            onNew={handleCreate}
            newButtonLabel="New workflow"
            disabled={disabled}
            isCreating={createWorkflow.isPending}
        />
        </>
    )
}


export const WorkflowsPagination = () => {
    const worklflows = useSuspenseWorkflows()
    const [params, setParams] = useWorkflowParams()

    return (
    <EntityPagination 
        disabled={worklflows.isFetching}
        totalPages={worklflows.data.totalPages}
        page={worklflows.data.page}
        onPageChange={(page) => setParams({ ...params, page })}
    />
    )
}


export const WorkflowsContainer = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch/>}
            pagination={<WorkflowsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading Workflows..."/>
}

export const WorkflowsError = () => {
    return <ErrorView message="Error Loading Workflows..."/>
}

export const WorkflowsEmpty = () => {
    const router = useRouter()
    const createWorkflow = useCreateWorkflow()
    const { handleError, modal } = useUpgradeModal()

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
        onSuccess: (data) => {
            router.push(`/workflows/${data.id}`)
        },
        onError: (error) => {
            handleError(error)
        }
        })
    }
    return (
        <>
        {modal}
        <EmptyView
            onNew={handleCreate}
            message="No Workflows found. Get started by creating your Workflow"
        />
        </>
    )
}

export const WorkflowItem = ({
    data
}: {
    data: Workflow
}) => {

    const removeWorkflow = useRemoveWorkflow()

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id })
    }

    return (
        <EntityItem 
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle = {
            <>
            Updated {formatDistanceToNow(data.updatedAt, { addSuffix:true })}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt, { addSuffix:true })} 
            </>
        }
        image={
            <div className='size-8 flex items-center justify-center'>
            <WorkflowIcon className='size-5 text-muted-foreground'/>
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeWorkflow.isPending}
        />
    )
}