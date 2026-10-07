import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly troubleMarkerSeconds: number;
  readonly repairInitiationSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    troubleMarkerSeconds: { type: "number" },
    repairInitiationSeconds: { type: "number" },
  },
  required: ["troubleMarkerSeconds", "repairInitiationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit conversational trouble and repair-initiation markers without classifying interaction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { troubleMarkerSeconds, repairInitiationSeconds } = request;
  const compute = (): Output => {
    return { signedGap: repairInitiationSeconds - troubleMarkerSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { troubleMarkerSeconds: 12, repairInitiationSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const conversationRepairInitiationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/conversation-repair-initiation-gap",
    title: "Conversation Repair Initiation Gap",
    description:
      "Subtract explicit conversational trouble and repair-initiation markers without classifying interaction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        troubleMarkerSeconds: { type: "number" },
        repairInitiationSeconds: { type: "number" },
      },
      required: ["troubleMarkerSeconds", "repairInitiationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "troubleMarkerSeconds",
          label: "Trouble Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repairInitiationSeconds",
          label: "Repair Initiation Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = conversationRepairInitiationGapTool.execute;
export default conversationRepairInitiationGapTool;
