import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: readonly number[];
  readonly matchingColumn: readonly number[];
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "array", maxItems: 256, items: { type: "number" } },
    matchingColumn: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["row", "matchingColumn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Compute one diagonal contribution to trace(A B) from a supplied row of A and matching column of B. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, matchingColumn } = request;
  const compute = (): Output => {
    return { contribution: H.dot(row, matchingColumn) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: [1, 2], matchingColumn: [3, 4] },
  output: { contribution: 11 },
} satisfies ToolExample<Input, Output>;
export const matrixTraceProductContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-trace-product-contribution",
    title: "Matrix Trace Product Contribution Tool",
    description:
      "Compute one diagonal contribution to trace(A B) from a supplied row of A and matching column of B.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "array", maxItems: 256, items: { type: "number" } },
        matchingColumn: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["row", "matchingColumn"],
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
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "matchingColumn",
          label: "Matching Column",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
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
export const run = matrixTraceProductContributionTool.execute;
export default matrixTraceProductContributionTool;
