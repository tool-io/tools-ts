import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly threadId: string; readonly status: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    threadId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["introduced", "developing", "resolved", "abandoned", "open"],
    },
  },
  required: ["threadId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Render a writer-assigned plot-thread state without analysing or generating story content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { threadId, status } = request;
  const compute = (): Output => {
    H.domain(threadId.length > 0, "threadId");
    H.domain(
      ["introduced", "developing", "resolved", "abandoned", "open"].includes(
        status,
      ),
      "status",
    );
    return { tag: threadId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { threadId: "T17", status: "developing" },
  output: { tag: "T17 [developing]" },
} satisfies ToolExample<Input, Output>;
export const plotThreadStatusTagTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["creative-writing", "creative writing", "humanities"],
        keywords: ["creative writing", "humanities"],
      },
      id: "creative-writing/plot-thread-status-tag",
      title: "Plot Thread Status Tag",
      description:
        "Render a writer-assigned plot-thread state without analysing or generating story content.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          threadId: { type: "string", maxLength: 8192, minLength: 1 },
          status: {
            type: "string",
            maxLength: 8192,
            enum: ["introduced", "developing", "resolved", "abandoned", "open"],
          },
        },
        required: ["threadId", "status"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { tag: { type: "string", maxLength: 8192 } },
        required: ["tag"],
      },
      ports: {
        inputs: [
          {
            id: "threadId",
            label: "Thread Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "status",
            label: "Status",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
      },
    },
    calculate,
  },
);
export const run = plotThreadStatusTagTool.execute;
export default plotThreadStatusTagTool;
