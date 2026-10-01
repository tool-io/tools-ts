import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly score: number;
  readonly scale: number;
};
export type Output = { readonly location: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    score: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "score", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { location: { type: "number" } },
  required: ["location"],
} as const;
/** Calculate reference zscore offset recovery from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, score, scale } = input;
  const compute = (): Output => {
    H.positive(scale);
    return { location: value - score * scale };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 12, score: 2, scale: 3 },
  output: { location: 6 },
} satisfies ToolExample<Input, Output>;
export const referenceZscoreOffsetRecoveryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/reference-zscore-offset-recovery",
    title: "Reference Zscore Offset Recovery Tool",
    description:
      "Calculate reference zscore offset recovery from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        score: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "score", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { location: { type: "number" } },
      required: ["location"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "location", label: "Location", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = referenceZscoreOffsetRecoveryTool.execute;
export default referenceZscoreOffsetRecoveryTool;
