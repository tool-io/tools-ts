import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
  readonly requiredSilence: number;
};
export type Output = {
  readonly silence: number;
  readonly margin: number;
  readonly overlaps: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
    requiredSilence: { type: "number", minimum: 0 },
  },
  required: ["previousEnd", "nextStart", "requiredSilence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    silence: { type: "number" },
    margin: { type: "number" },
    overlaps: { type: "boolean" },
  },
  required: ["silence", "margin", "overlaps"],
} as const;
/** Calculate conversation silence window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart, requiredSilence } = request;
  const compute = (): Output => {
    H.domain(requiredSilence >= 0);
    return {
      silence: nextStart - previousEnd,
      margin: nextStart - previousEnd - requiredSilence,
      overlaps: nextStart < previousEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousEnd: 10, nextStart: 13, requiredSilence: 2 },
  output: { silence: 3, margin: 1, overlaps: false },
} satisfies ToolExample<Input, Output>;
export const conversationSilenceWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/conversation-silence-window-gap",
    title: "Conversation Silence Window Gap Tool",
    description:
      "Calculate conversation silence window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEnd: { type: "number" },
        nextStart: { type: "number" },
        requiredSilence: { type: "number", minimum: 0 },
      },
      required: ["previousEnd", "nextStart", "requiredSilence"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        silence: { type: "number" },
        margin: { type: "number" },
        overlaps: { type: "boolean" },
      },
      required: ["silence", "margin", "overlaps"],
    },
    ports: {
      inputs: [
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredSilence",
          label: "Required Silence",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "silence", label: "Silence", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = conversationSilenceWindowGapTool.execute;
export default conversationSilenceWindowGapTool;
