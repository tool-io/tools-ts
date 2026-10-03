import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly covered: number;
  readonly eligible: number;
  readonly reportedShare: number;
};
export type Output = {
  readonly share: number;
  readonly residual: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covered: { type: "integer", minimum: 0 },
    eligible: { type: "integer", minimum: 0 },
    reportedShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["covered", "eligible", "reportedShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    residual: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["share", "residual", "defined"],
} as const;
/** Audit a supplied coverage count and reported fraction without choosing an eligibility definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { covered, eligible, reportedShare } = request;
  const compute = (): Output => {
    H.integer(eligible, 0);
    H.integer(covered, 0, eligible);
    H.probability(reportedShare);
    return {
      share: eligible > 0 ? covered / eligible : 0,
      residual: eligible > 0 ? reportedShare - covered / eligible : 0,
      defined: eligible > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { covered: 60, eligible: 100, reportedShare: 0.7 },
  output: { share: 0.6, residual: 0.09999999999999998, defined: true },
} satisfies ToolExample<Input, Output>;
export const coveragePopulationCellGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/coverage-population-cell-gap",
    title: "Coverage Population Cell Gap Tool",
    description:
      "Audit a supplied coverage count and reported fraction without choosing an eligibility definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        covered: { type: "integer", minimum: 0 },
        eligible: { type: "integer", minimum: 0 },
        reportedShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["covered", "eligible", "reportedShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        share: { type: "number" },
        residual: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["share", "residual", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "covered",
          label: "Covered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportedShare",
          label: "Reported Share",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = coveragePopulationCellGapTool.execute;
export default coveragePopulationCellGapTool;
