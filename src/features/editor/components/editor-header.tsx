"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const EditorSaveButton = ({ workflowId } : {workflowId: string}) => {
    return (
        <div className="ml-auto">
            <Button size="sm" onClick = {() => {}} disabled = {false}>
                <SaveIcon className="size-4"/>
            </Button>
        </div>
    )
}

export const EditorNameInput = ({ workflowdId } : {workflowdId : string}) => {
    const { data: workflow } = useSuspenseWorkflow(workflowdId);
    const updateWorkflowName = useUpdateWorkflowName();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(workflow.name) {
            setName(workflow.name)
        }
    }, [workflow.name])
    
    useEffect(() => {
        if(isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing])

    const handleSave = async () => {
        if(name === workflow.name) {
            setIsEditing(false);
            return;
        }
        
        try {
            await updateWorkflowName.mutateAsync({
                id: workflow.id,
                name
            })
        } catch {
            setName(workflow.name);
        } finally {
            setIsEditing(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            handleSave();
        }else if(e.key === 'Escape'){
            setName(workflow.name);
            setIsEditing(false);
        }   
    }

    if(isEditing) {
        return <Input
            ref = {inputRef}
            value = {name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-7 w-auto min-w-[100px] px-2"
            disabled = {updateWorkflowName.isPending}
        />
    }

    return (

        <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {workflow.name}
        </BreadcrumbItem>
    )
}

export const EditorBreadCrumbs = ({
    workflowId
} : {
    workflowId: string
}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href="/workflows">
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
                <EditorNameInput workflowdId={workflowId}/>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className="flex h-14 shrink-0 items-center gap02 border-b px-4
        bg-background">
            <SidebarTrigger/>
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadCrumbs workflowId={workflowId}/>
                <EditorSaveButton workflowId = {workflowId}/>
            </div>
        </header>
    )
}

export default EditorHeader 