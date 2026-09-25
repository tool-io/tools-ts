import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: number;
  readonly measurement: number;
  readonly referenceWeight: number;
  readonly gain: number;
};
export type Output = {
  readonly weightedError: number;
  readonly proportionalTerm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "number" },
    measurement: { type: "number" },
    referenceWeight: { type: "number" },
    gain: { type: "number" },
  },
  required: ["reference", "measurement", "referenceWeight", "gain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedError: { type: "number" },
    proportionalTerm: { type: "number" },
  },
  required: ["weightedError", "proportionalTerm"],
} as const;
/** Two-degree-of-freedom proportional reference weighting with explicit coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, measurement, referenceWeight, gain } = request;
  const compute = (): Output => {
    return {
      weightedError: referenceWeight * reference - measurement,
      proportionalTerm: gain * (referenceWeight * reference - measurement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: 10, measurement: 7, referenceWeight: 0.8, gain: 2 },
  output: { weightedError: 1, proportionalTerm: 2 },
} satisfies ToolExample<Input, Output>;
export const referenceWeightFeedthroughTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/reference-weight-feedthrough-term",
    title: "Reference Weight Feedthrough Term Tool",
    description:
      "Two-degree-of-freedom proportional reference weighting with explicit coefficients.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "number" },
        measurement: { type: "number" },
        referenceWeight: { type: "number" },
        gain: { type: "number" },
      },
      required: ["reference", "measurement", "referenceWeight", "gain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedError: { type: "number" },
        proportionalTerm: { type: "number" },
      },
      required: ["weightedError", "proportionalTerm"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurement",
          label: "Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceWeight",
          label: "Reference Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gain",
          label: "Gain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedError",
          label: "Weighted Error",
          valueType: { type: "number" },
        },
        {
          id: "proportionalTerm",
          label: "Proportional Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referenceWeightFeedthroughTermTool.execute;
export default referenceWeightFeedthroughTermTool;
