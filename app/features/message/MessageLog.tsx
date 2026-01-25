"use client";
import {
    DataTableSkeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    Tag,
    OverflowMenu,
    OverflowMenuItem,
} from "@carbon/react";
import { useGetAllConversations } from "./hooks/useMessage";
import { useState } from "react";
import { ViewConversationModal } from "./components/ViewConversationModal";
import { Conversation } from "@/app/types";

export const MessageLog = () => {
    const { data: conversations, isPending } = useGetAllConversations();
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [openView, setOpenView] = useState(false);
    const [search, setSearch] = useState("");

    const handleViewConversation = (conv: Conversation) => {
        setSelectedConv(conv);
        setOpenView(true);
    };

    const filteredConversations = conversations?.filter(conv =>
        conv.id.toString().includes(search) ||
        conv.participant_one_id.toString().includes(search) ||
        conv.participant_two_id.toString().includes(search) ||
        conv.product?.name.toLowerCase().includes(search.toLowerCase()) ||
        conv.messages?.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
    );

    if (isPending) {
        return (
            <DataTableSkeleton
                headers={[
                    { header: "ID", key: "id" },
                    { header: "Participants", key: "participants" },
                    { header: "Product", key: "product" },
                    { header: "Latest Message", key: "latest" },
                    { header: "Last Activity", key: "date" },
                    { header: "Actions", key: "actions" },
                ]}
            />
        );
    }

    return (
        <section className="p-0!">
            <ViewConversationModal
                open={openView}
                onClose={() => {
                    setOpenView(false);
                    setSelectedConv(null);
                }}
                conversation={selectedConv}
            />
            <TableContainer title="Message Logs" description="View all communications in the system">
                <TableToolbar>
                    <TableToolbarContent>
                        <TableToolbarSearch
                            value={search}
                            onChange={(_, value) => setSearch(value || "")}
                        />
                    </TableToolbarContent>
                </TableToolbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>Participants</TableHeader>
                            <TableHeader>Product</TableHeader>
                            <TableHeader>Latest Message</TableHeader>
                            <TableHeader>Messages</TableHeader>
                            <TableHeader>Last Activity</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredConversations?.map((conv) => (
                            <TableRow key={conv.id}>
                                <TableCell>{conv.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">P1: {conv.participant_one_id}</span>
                                        <span className="text-xs text-gray-400">P2: {conv.participant_two_id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {conv.product ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{conv.product.name}</span>
                                            <span className="text-xs text-gray-400">Price: {conv.product.price}</span>
                                        </div>
                                    ) : (
                                        <Tag type="gray">General</Tag>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-xs truncate">
                                        {conv.messages && conv.messages.length > 0
                                            ? conv.messages[conv.messages.length - 1].content
                                            : "No messages"}
                                    </div>
                                </TableCell>
                                <TableCell>{conv.messages?.length || 0}</TableCell>
                                <TableCell>
                                    {conv.updated_at ? new Date(conv.updated_at).toLocaleString() : "N/A"}
                                </TableCell>
                                <TableCell>
                                    <OverflowMenu flipped>
                                        <OverflowMenuItem
                                            itemText="View Conversation"
                                            onClick={() => handleViewConversation(conv)}
                                        />
                                    </OverflowMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!filteredConversations || filteredConversations.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No conversations found in the system.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    );
};
