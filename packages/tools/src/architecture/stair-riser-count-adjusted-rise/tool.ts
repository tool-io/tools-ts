import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalRise: number;
  readonly riserCount: number;
  readonly suppliedFinishCorrection: number;
};
export type Output = {
  readonly adjustedTotalRise: number;
  readonly equalRiserHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRise: { type: "number", minimum: 0 },
    riserCount: { type: "integer", minimum: 1 },
    suppliedFinishCorrection: { type: "number" },
  },
  required: ["totalRise", "riserCount", "suppliedFinishCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedTotalRise: { type: "number" },
    equalRiserHeight: { type: "number" },
  },
  required: ["adjustedTotalRise", "equalRiserHeight"],
} as const;
/** Divide an explicit finish-corrected stair rise into equal risers without choosing counts or checking building codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalRise, riserCount, suppliedFinishCorrection } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(riserCount) &&
        riserCount >= 1 &&
        riserCount <= Number.MAX_SAFE_INTEGER,
      "riserCount",
    ),
      riserCount);
    H.domain(
      totalRise >= 0 && totalRise + suppliedFinishCorrection >= 0,
      "totalRise",
    );
    return {
      adjustedTotalRise: totalRise + suppliedFinishCorrection,
      equalRiserHeight: (totalRise + suppliedFinishCorrection) / riserCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalRise: 2800, riserCount: 14, suppliedFinishCorrection: 0 },
  output: { adjustedTotalRise: 2800, equalRiserHeight: 200 },
} satisfies ToolExample<Input, Output>;
export const stairRiserCountAdjustedRiseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/stair-riser-count-adjusted-rise",
    title: "Stair Riser Count Adjusted Rise",
    description:
      "Divide an explicit finish-corrected stair rise into equal risers without choosing counts or checking building codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRise: { type: "number", minimum: 0 },
        riserCount: { type: "integer", minimum: 1 },
        suppliedFinishCorrection: { type: "number" },
      },
      required: ["totalRise", "riserCount", "suppliedFinishCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedTotalRise: { type: "number" },
        equalRiserHeight: { type: "number" },
      },
      required: ["adjustedTotalRise", "equalRiserHeight"],
    },
    ports: {
      inputs: [
        {
          id: "totalRise",
          label: "Total Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "riserCount",
          label: "Riser Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedFinishCorrection",
          label: "Supplied Finish Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedTotalRise",
          label: "Adjusted Total Rise",
          valueType: { type: "number" },
        },
        {
          id: "equalRiserHeight",
          label: "Equal Riser Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stairRiserCountAdjustedRiseTool.execute;
export default stairRiserCountAdjustedRiseTool;
