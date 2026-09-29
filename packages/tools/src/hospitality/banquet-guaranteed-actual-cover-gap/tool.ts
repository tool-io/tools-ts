import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly guaranteed: number;
  readonly actual: number;
  readonly unitCharge: number;
};
export type Output = {
  readonly billedCovers: number;
  readonly unusedGuarantee: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guaranteed: { type: "integer", minimum: 0 },
    actual: { type: "integer", minimum: 0 },
    unitCharge: { type: "number", minimum: 0 },
  },
  required: ["guaranteed", "actual", "unitCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billedCovers: { type: "integer" },
    unusedGuarantee: { type: "integer" },
    total: { type: "number" },
  },
  required: ["billedCovers", "unusedGuarantee", "total"],
} as const;
/** Use an explicit maximum-of-guarantee-and-actual charging convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { guaranteed, actual, unitCharge } = request;
  const compute = (): Output => {
    H.integer(guaranteed, 0);
    H.integer(actual, 0);
    H.domain(unitCharge >= 0);
    return {
      billedCovers: Math.max(guaranteed, actual),
      unusedGuarantee: Math.max(0, guaranteed - actual),
      total: Math.max(guaranteed, actual) * unitCharge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { guaranteed: 100, actual: 90, unitCharge: 20 },
  output: { billedCovers: 100, unusedGuarantee: 10, total: 2000 },
} satisfies ToolExample<Input, Output>;
export const banquetGuaranteedActualCoverGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/banquet-guaranteed-actual-cover-gap",
    title: "Banquet Guaranteed Actual Cover Gap Tool",
    description:
      "Use an explicit maximum-of-guarantee-and-actual charging convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guaranteed: { type: "integer", minimum: 0 },
        actual: { type: "integer", minimum: 0 },
        unitCharge: { type: "number", minimum: 0 },
      },
      required: ["guaranteed", "actual", "unitCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billedCovers: { type: "integer" },
        unusedGuarantee: { type: "integer" },
        total: { type: "number" },
      },
      required: ["billedCovers", "unusedGuarantee", "total"],
    },
    ports: {
      inputs: [
        {
          id: "guaranteed",
          label: "Guaranteed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitCharge",
          label: "Unit Charge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billedCovers",
          label: "Billed Covers",
          valueType: { type: "integer" },
        },
        {
          id: "unusedGuarantee",
          label: "Unused Guarantee",
          valueType: { type: "integer" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = banquetGuaranteedActualCoverGapTool.execute;
export default banquetGuaranteedActualCoverGapTool;
