import { createFileRoute } from "@tanstack/react-router";
import { handleRiplChat } from "@/lib/ripl-chat.server";
export const Route = createFileRoute("/api/chat")({ server: { handlers: { POST: ({ request }) => handleRiplChat(request) } } });
