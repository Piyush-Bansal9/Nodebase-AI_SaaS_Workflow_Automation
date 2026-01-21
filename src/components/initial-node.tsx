"use client"

import type { NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { PlaceholderNode } from "./react-flow/placeholder-node"
import { PlusIcon } from "lucide-react"
import { WorkflowNode } from "./workflow-node"
import { NodeSelector } from "./node-selector"
// import { WorkflowNode } from "./WorkflowNode"


export const InitialNode = memo((props: NodeProps) => {
    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <NodeSelector open = {selectorOpen} onOpenChange = {setSelectorOpen}>
            <WorkflowNode
                showToolbar={false}
                // name="New Node"
                // description="Heyy"
            >
                <PlaceholderNode
                    {...props}
                    onClick = {() => {setSelectorOpen(true)}}
                >
                    <div className="cursor-pointer flex items-center justify-center">
                        <PlusIcon className="size-4"/>
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
})

InitialNode.displayName = "InitialNode"