import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalVolume: number;
  readonly aliquotVolumes: readonly number[];
  readonly retainedVolume: number;
};
export type Output = {
  readonly allocatedVolume: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number", minimum: 0 },
    aliquotVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    retainedVolume: { type: "number", minimum: 0 },
  },
  required: ["totalVolume", "aliquotVolumes", "retainedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedVolume: { type: "number" },
    remainder: { type: "number" },
  },
  required: ["allocatedVolume", "remainder"],
} as const;
/** Supplied research specimen-volume ledger without collection or processing recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalVolume, aliquotVolumes, retainedVolume } = request;
  const compute = (): Output => {
    H.domain(
      totalVolume >= 0 &&
        retainedVolume >= 0 &&
        aliquotVolumes.every((x) => x >= 0) &&
        aliquotVolumes.reduce((a, b) => a + b, 0) + retainedVolume <=
          totalVolume,
    );
    return {
      allocatedVolume:
        aliquotVolumes.reduce((a, b) => a + b, 0) + retainedVolume,
      remainder:
        totalVolume -
        aliquotVolumes.reduce((a, b) => a + b, 0) -
        retainedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalVolume: 10, aliquotVolumes: [2, 3], retainedVolume: 1 },
  output: { allocatedVolume: 6, remainder: 4 },
} satisfies ToolExample<Input, Output>;
export const sampleAliquotRetentionBudgetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/sample-aliquot-retention-budget-token",
    title: "Sample Aliquot Retention Budget Token Tool",
    description:
      "Supplied research specimen-volume ledger without collection or processing recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number", minimum: 0 },
        aliquotVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        retainedVolume: { type: "number", minimum: 0 },
      },
      required: ["totalVolume", "aliquotVolumes", "retainedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedVolume: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["allocatedVolume", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aliquotVolumes",
          label: "Aliquot Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "retainedVolume",
          label: "Retained Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedVolume",
          label: "Allocated Volume",
          valueType: { type: "number" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleAliquotRetentionBudgetTokenTool.execute;
export default sampleAliquotRetentionBudgetTokenTool;
