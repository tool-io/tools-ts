import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly facilityLimit: number;
  readonly drawnAmount: number;
  readonly annualFeeFraction: number;
  readonly yearFraction: number;
};
export type Output = {
  readonly unusedAmount: number;
  readonly commitmentFee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    facilityLimit: { type: "number", minimum: 0 },
    drawnAmount: { type: "number", minimum: 0 },
    annualFeeFraction: { type: "number", minimum: 0 },
    yearFraction: { type: "number", minimum: 0 },
  },
  required: [
    "facilityLimit",
    "drawnAmount",
    "annualFeeFraction",
    "yearFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unusedAmount: { type: "number" },
    commitmentFee: { type: "number" },
  },
  required: ["unusedAmount", "commitmentFee"],
} as const;
/** Extend a supplied commitment-fee rate over unused facility principal and an explicit year fraction without selecting a day-count convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { facilityLimit, drawnAmount, annualFeeFraction, yearFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      facilityLimit >= 0 &&
        drawnAmount >= 0 &&
        drawnAmount <= facilityLimit &&
        annualFeeFraction >= 0 &&
        yearFraction >= 0,
      "facilityLimit",
    );
    return {
      unusedAmount: facilityLimit - drawnAmount,
      commitmentFee:
        (facilityLimit - drawnAmount) * annualFeeFraction * yearFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    facilityLimit: 1000000,
    drawnAmount: 600000,
    annualFeeFraction: 0.005,
    yearFraction: 0.25,
  },
  output: { unusedAmount: 400000, commitmentFee: 500 },
} satisfies ToolExample<Input, Output>;
export const facilityCommitmentFeeUnusedBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/facility-commitment-fee-unused-base",
    title: "Facility Commitment Fee Unused Base",
    description:
      "Extend a supplied commitment-fee rate over unused facility principal and an explicit year fraction without selecting a day-count convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        facilityLimit: { type: "number", minimum: 0 },
        drawnAmount: { type: "number", minimum: 0 },
        annualFeeFraction: { type: "number", minimum: 0 },
        yearFraction: { type: "number", minimum: 0 },
      },
      required: [
        "facilityLimit",
        "drawnAmount",
        "annualFeeFraction",
        "yearFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unusedAmount: { type: "number" },
        commitmentFee: { type: "number" },
      },
      required: ["unusedAmount", "commitmentFee"],
    },
    ports: {
      inputs: [
        {
          id: "facilityLimit",
          label: "Facility Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drawnAmount",
          label: "Drawn Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualFeeFraction",
          label: "Annual Fee Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearFraction",
          label: "Year Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unusedAmount",
          label: "Unused Amount",
          valueType: { type: "number" },
        },
        {
          id: "commitmentFee",
          label: "Commitment Fee",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = facilityCommitmentFeeUnusedBaseTool.execute;
export default facilityCommitmentFeeUnusedBaseTool;
