import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTimeInSeconds: number;
  readonly targetTimeInSeconds: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTimeInSeconds: { type: "number", exclusiveMinimum: 0 },
    targetTimeInSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceTimeInSeconds", "targetTimeInSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Convert numeric inverse-source-time values to inverse-target-time values using explicit unit sizes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTimeInSeconds, targetTimeInSeconds } = request;
  const compute = (): Output => {
    H.positive(sourceTimeInSeconds);
    H.positive(targetTimeInSeconds);
    return { factor: targetTimeInSeconds / sourceTimeInSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceTimeInSeconds: 60, targetTimeInSeconds: 1 },
  output: { factor: 0.016666666666666666 },
} satisfies ToolExample<Input, Output>;
export const reciprocalTimeUnitRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/reciprocal-time-unit-ratio",
    title: "Reciprocal Time Unit Ratio Tool",
    description:
      "Convert numeric inverse-source-time values to inverse-target-time values using explicit unit sizes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTimeInSeconds: { type: "number", exclusiveMinimum: 0 },
        targetTimeInSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceTimeInSeconds", "targetTimeInSeconds"],
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
          id: "sourceTimeInSeconds",
          label: "Source Time In Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetTimeInSeconds",
          label: "Target Time In Seconds",
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
export const run = reciprocalTimeUnitRatioTool.execute;
export default reciprocalTimeUnitRatioTool;
