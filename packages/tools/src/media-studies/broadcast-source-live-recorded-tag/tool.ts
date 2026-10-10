import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly itemId: string; readonly sourceMode: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceMode: {
      type: "string",
      maxLength: 8192,
      enum: ["live", "recorded", "mixed", "unknown"],
    },
  },
  required: ["itemId", "sourceMode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported broadcast source mode without inferring liveness from media content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, sourceMode } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(
      ["live", "recorded", "mixed", "unknown"].includes(sourceMode),
      "sourceMode",
    );
    return { label: itemId + " [" + sourceMode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemId: "I17", sourceMode: "live" },
  output: { label: "I17 [live]" },
} satisfies ToolExample<Input, Output>;
export const broadcastSourceLiveRecordedTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/broadcast-source-live-recorded-tag",
    title: "Broadcast Source Live Recorded Tag",
    description:
      "Label an explicitly reported broadcast source mode without inferring liveness from media content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceMode: {
          type: "string",
          maxLength: 8192,
          enum: ["live", "recorded", "mixed", "unknown"],
        },
      },
      required: ["itemId", "sourceMode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceMode",
          label: "Source Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = broadcastSourceLiveRecordedTagTool.execute;
export default broadcastSourceLiveRecordedTagTool;
