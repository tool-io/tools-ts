import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedOffset: number;
  readonly targetOffset: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedOffset: { type: "number" },
    targetOffset: { type: "number" },
  },
  required: ["observedOffset", "targetOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied agricultural track coordinates without navigation or machine-control advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedOffset, targetOffset } = request;
  const compute = (): Output => {
    return { gap: observedOffset - targetOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedOffset: 3, targetOffset: 2 },
  output: { gap: 1 },
} satisfies ToolExample<Input, Output>;
export const tractorTrackOffsetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/tractor-track-offset-gap",
    title: "Tractor Track Offset Gap Tool",
    description:
      "Compare supplied agricultural track coordinates without navigation or machine-control advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedOffset: { type: "number" },
        targetOffset: { type: "number" },
      },
      required: ["observedOffset", "targetOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "observedOffset",
          label: "Observed Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetOffset",
          label: "Target Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = tractorTrackOffsetGapTool.execute;
export default tractorTrackOffsetGapTool;
