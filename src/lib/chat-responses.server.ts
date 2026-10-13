import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage, type UIMessage } from "ai";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./chat-run-id.server.ts";

export function createResponsesCall(
  request: Request,
  config: { baseURL: string; apiKey: string; model: string },
  messages: ModelMessage[],
  instructions?: string,
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  let gatewayFailure: { status: number; text: string } | undefined;
  const provider = createOpenAI({
    baseURL: `${config.baseURL.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1`,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const upstream = await runIdFetch.fetch(input, init);
      if (!upstream.ok)
        gatewayFailure = { status: upstream.status, text: await upstream.clone().text() };
      return upstream;
    },
  });
  const reasoning = config.model !== "openai/chat-latest";
  const result = streamText({
    model: provider.responses(config.model),
    // AI SDK 6 lacks `instructions`: rename this key to `system` there.
    ...(instructions ? { instructions } : {}),
    messages,
    maxRetries: 0,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        ...(reasoning
          ? {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            }
          : {}),
      },
    },
  });
  return {
    result,
    response: async (messages: UIMessage[]) => {
      const stream = result.toUIMessageStreamResponse({
        originalMessages: messages,
        sendReasoning: true,
        onFinish: () => {},
        onError: (error) => (error instanceof Error ? error.message : "Assistant unavailable"),
      });
      const wrapped = await withLovableAiGatewayRunIdHeader(stream, runIdFetch);
      if (gatewayFailure) {
        let message = "Assistant unavailable";
        try {
          const body = JSON.parse(gatewayFailure.text);
          message = body.error?.message ?? body.message ?? message;
        } catch {
          /* Keep the safe fallback. */
        }
        await wrapped.body?.cancel();
        return new Response(message, { status: gatewayFailure.status });
      }
      return wrapped;
    },
  };
}
