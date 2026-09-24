import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceLengthInMeters: number;
  readonly targetLengthInMeters: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceLengthInMeters: { type: "number", exclusiveMinimum: 0 },
    targetLengthInMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceLengthInMeters", "targetLengthInMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Convert numeric inverse-source-length values to inverse-target-length values using explicit unit sizes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceLengthInMeters, targetLengthInMeters } = request;
  const compute = (): Output => {
    H.positive(sourceLengthInMeters);
    H.positive(targetLengthInMeters);
    return { factor: targetLengthInMeters / sourceLengthInMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceLengthInMeters: 0.01, targetLengthInMeters: 1 },
  output: { factor: 100 },
} satisfies ToolExample<Input, Output>;
export const reciprocalLengthUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/reciprocal-length-unit-factor",
    title: "Reciprocal Length Unit Factor Tool",
    description:
      "Convert numeric inverse-source-length values to inverse-target-length values using explicit unit sizes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceLengthInMeters: { type: "number", exclusiveMinimum: 0 },
        targetLengthInMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceLengthInMeters", "targetLengthInMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
    },
    ports: {
      inputs: [
        {
          id: "sourceLengthInMeters",
          label: "Source Length In Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLengthInMeters",
          label: "Target Length In Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reciprocalLengthUnitFactorTool.execute;
export default reciprocalLengthUnitFactorTool;
