import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly row: readonly number[] };
export type Output = {
  readonly positiveCount: number;
  readonly negativeCount: number;
  readonly zeroCount: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["row"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveCount: { type: "integer" },
    negativeCount: { type: "integer" },
    zeroCount: { type: "integer" },
    balanced: { type: "boolean" },
  },
  required: ["positiveCount", "negativeCount", "zeroCount", "balanced"],
} as const;
/** Calculate matrix row balanced sign count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row } = request;
  const compute = (): Output => {
    return {
      positiveCount: row.filter((x) => x > 0).length,
      negativeCount: row.filter((x) => x < 0).length,
      zeroCount: row.filter((x) => x === 0).length,
      balanced:
        row.filter((x) => x > 0).length === row.filter((x) => x < 0).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: [2, -3, 0] },
  output: { positiveCount: 1, negativeCount: 1, zeroCount: 1, balanced: true },
} satisfies ToolExample<Input, Output>;
export const matrixRowBalancedSignCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-row-balanced-sign-count",
    title: "Matrix Row Balanced Sign Count Tool",
    description:
      "Calculate matrix row balanced sign count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["row"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveCount: { type: "integer" },
        negativeCount: { type: "integer" },
        zeroCount: { type: "integer" },
        balanced: { type: "boolean" },
      },
      required: ["positiveCount", "negativeCount", "zeroCount", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "positiveCount",
          label: "Positive Count",
          valueType: { type: "integer" },
        },
        {
          id: "negativeCount",
          label: "Negative Count",
          valueType: { type: "integer" },
        },
        {
          id: "zeroCount",
          label: "Zero Count",
          valueType: { type: "integer" },
        },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = matrixRowBalancedSignCountTool.execute;
export default matrixRowBalancedSignCountTool;
