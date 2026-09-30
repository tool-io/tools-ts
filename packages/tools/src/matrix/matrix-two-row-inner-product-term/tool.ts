import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: readonly number[];
  readonly right: readonly number[];
};
export type Output = {
  readonly terms: readonly number[];
  readonly sum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "array", maxItems: 256, items: { type: "number" } },
    right: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terms: { type: "array", maxItems: 256, items: { type: "number" } },
    sum: { type: "number" },
  },
  required: ["terms", "sum"],
} as const;
/** Compute matrix two row inner product term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    sameLength(left, right);
    const terms = left.map((x, i) => x * right[i]);
    return { terms, sum: terms.reduce((a, b) => a + b, 0) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: [1, 2], right: [3, 4] },
  output: { terms: [3, 8], sum: 11 },
} satisfies ToolExample<Input, Output>;
export const matrixTwoRowInnerProductTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-two-row-inner-product-term",
  title: "Matrix Two Row Inner Product Term Tool",
  description:
    "Compute matrix two row inner product term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      {
        id: "terms",
        label: "Terms",
        valueType: { type: "list", items: { type: "number" } },
      },
      { id: "sum", label: "Sum", valueType: { type: "number" } },
    ],
  },
});
export const run = matrixTwoRowInnerProductTermTool.execute;
export default matrixTwoRowInnerProductTermTool;
