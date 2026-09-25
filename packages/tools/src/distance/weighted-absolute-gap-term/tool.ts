import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly weight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["first", "second", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate weighted absolute gap term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return { contribution: Math.abs(first - second) * weight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 2, second: 5, weight: 0.5 },
  output: { contribution: 1.5 },
} satisfies ToolExample<Input, Output>;
export const weightedAbsoluteGapTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/weighted-absolute-gap-term",
    title: "Weighted Absolute Gap Term Tool",
    description:
      "Calculate weighted absolute gap term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["first", "second", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedAbsoluteGapTermTool.execute;
export default weightedAbsoluteGapTermTool;
