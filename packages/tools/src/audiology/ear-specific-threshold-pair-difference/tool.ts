import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly sameReference: boolean;
};
export type Output = { readonly leftMinusRight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    sameReference: { type: "boolean" },
  },
  required: ["left", "right", "sameReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leftMinusRight: { type: "number" } },
  required: ["leftMinusRight"],
} as const;
/** Subtract supplied paired research measurements only when their reference basis is declared comparable; no diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right, sameReference } = request;
  const compute = (): Output => {
    H.domain(sameReference);
    return { leftMinusRight: left - right };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 20, right: 35, sameReference: true },
  output: { leftMinusRight: -15 },
} satisfies ToolExample<Input, Output>;
export const earSpecificThresholdPairDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/ear-specific-threshold-pair-difference",
    title: "Ear Specific Threshold Pair Difference Tool",
    description:
      "Subtract supplied paired research measurements only when their reference basis is declared comparable; no diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        right: { type: "number" },
        sameReference: { type: "boolean" },
      },
      required: ["left", "right", "sameReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leftMinusRight: { type: "number" } },
      required: ["leftMinusRight"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sameReference",
          label: "Same Reference",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "leftMinusRight",
          label: "Left Minus Right",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = earSpecificThresholdPairDifferenceTool.execute;
export default earSpecificThresholdPairDifferenceTool;
