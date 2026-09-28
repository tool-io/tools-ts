import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly targetTotal: number;
};
export type Output = { readonly total: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    targetTotal: { type: "number", minimum: 0 },
  },
  required: ["weights", "targetTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { total: { type: "number" }, remainder: { type: "number" } },
  required: ["total", "remainder"],
} as const;
/** Calculate global index weight remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, targetTotal } = request;
  const compute = (): Output => {
    H.domain(targetTotal >= 0 && weights.every((x) => x >= 0));
    return {
      total: weights.reduce((a, b) => a + b, 0),
      remainder: targetTotal - weights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [0.2, 0.3], targetTotal: 1 },
  output: { total: 0.5, remainder: 0.5 },
} satisfies ToolExample<Input, Output>;
export const globalIndexWeightRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-index-weight-remainder",
    title: "Global Index Weight Remainder Tool",
    description:
      "Calculate global index weight remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        targetTotal: { type: "number", minimum: 0 },
      },
      required: ["weights", "targetTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { total: { type: "number" }, remainder: { type: "number" } },
      required: ["total", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "targetTotal",
          label: "Target Total",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = globalIndexWeightRemainderTool.execute;
export default globalIndexWeightRemainderTool;
