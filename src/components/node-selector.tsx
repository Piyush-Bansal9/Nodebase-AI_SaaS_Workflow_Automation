"use client";

import { NodeType } from "@/generated/prisma";
import { createId } from "@paralleldrive/cuid2";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes : NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger Manually",
        description: "Runs the flow on clicking a button, good for getting started quickly.",
        icon: MousePointerIcon
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: "Google Form",
        description: "Runs the flow when a google form is submitted.",
        icon: "/logos/googleform.svg",
    },
    {
        type: NodeType.STRIPE_TRIGGER,
        label: "Stripe Event",
        description: "Runs the flow when a stripe event is captured.",
        icon: "/logos/stripe.svg",
    }
]

const executionNodes : NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP request.",
        icon: GlobeIcon
    },
    {
        type: NodeType.GEMINI,
        label: "Gemini",
        description: "Uses Google Gemini to generate text.",
        icon: "/logos/gemini.svg"
    },
    {
        type: NodeType.OPENAI,
        label: "OpenAI",
        description: "Uses OpenAI to generate text.",
        icon: "/logos/openai.svg"
    },
    {
        type: NodeType.DISCORD,
        label: "Discord",
        description: "Send a message to Discord",
        icon: "/logos/discord.svg"
    }
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function NodeSelector({
    open,
    onOpenChange,
    children
} : NodeSelectorProps) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
    const handleNodeSelect = useCallback((node: NodeTypeOption) => {
        if(node.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER
            );
            if(hasManualTrigger) {
                toast.error("Only one manual trigger is allowed per node per workflow.")
                return;
            }
        }

        setNodes((nodes) => {
                const hasInitialNode = nodes.some(
                    (node) => node.type === NodeType.INITIAL
                );

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const flowpPosition = screenToFlowPosition({
                    x: centerX + (Math.random() - 0.5) * 200,
                    y: centerY + (Math.random() - 0.5) * 200,
                })

                const newNode = {
                    id: createId(),
                    data: {},
                    position: flowpPosition,
                    type: node.type
                }

                if(hasInitialNode) {
                    return [newNode];
                }

                return [...nodes, newNode];
            })

            onOpenChange(false);
    }, [
        getNodes,
        setNodes,
        onOpenChange,
        screenToFlowPosition
    ])

    return (
        <Sheet open = {open} onOpenChange = {onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((triggerNode) => {
                        const Icon = triggerNode.icon;

                        return (
                            <div
                                key={triggerNode.type}
                                className="w-full justify-start h-auto py-5 px-4 
                                rounded-none cursor-pointer border-l-2 border-transparent
                                hover:border-l-primary"
                                onClick={() => handleNodeSelect(triggerNode)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            alt={triggerNode.label}
                                            className="size-5 object-contain rounded-sm"
                                        />
                                    ) : (
                                        <Icon className="size-5"/>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {triggerNode.label}
                                        </span>
                                        <span className="text-xs text-mutedt-foreground">
                                            {triggerNode.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator/>
                <div>
                    {executionNodes.map((executionNode) => {
                        const Icon = executionNode.icon;

                        return (
                            <div
                                key={executionNode.type}
                                className="w-full justify-start h-auto py-5 px-4 
                                rounded-none cursor-pointer border-l-2 border-transparent
                                hover:border-l-primary"
                                onClick={() => handleNodeSelect(executionNode)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            alt={executionNode.label}
                                            className="size-5 object-contain rounded-sm"
                                        />
                                    ) : (
                                        <Icon className="size-5"/>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {executionNode.label}
                                        </span>
                                        <span className="text-xs text-mutedt-foreground">
                                            {executionNode.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}
