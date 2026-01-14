"use client";

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useWorkflowParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

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
        <p>
            {JSON.stringify(workflows.data, null, 2)}
        </p>
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