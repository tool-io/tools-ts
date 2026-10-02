import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly joint: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0, maximum: 1 },
    second: { type: "number", minimum: 0, maximum: 1 },
    joint: { type: "number" },
  },
  required: ["first", "second", "joint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Calculate event independence product bound gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, joint } = input;
  const compute = (): Output => {
    H.probability(first);
    H.probability(second);
    H.domain(
      joint >= Math.max(0, first + second - 1) &&
        joint <= Math.min(first, second),
    );
    return { residual: joint - first * second };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 0.5, second: 0.5, joint: 0.4 },
  output: { residual: 0.15000000000000002 },
} satisfies ToolExample<Input, Output>;
export const eventIndependenceProductBoundGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/event-independence-product-bound-gap",
    title: "Event Independence Product Bound Gap Tool",
    description:
      "Calculate event independence product bound gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0, maximum: 1 },
        second: { type: "number", minimum: 0, maximum: 1 },
        joint: { type: "number" },
      },
      required: ["first", "second", "joint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
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
          id: "joint",
          label: "Joint",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = eventIndependenceProductBoundGapTool.execute;
export default eventIndependenceProductBoundGapTool;
