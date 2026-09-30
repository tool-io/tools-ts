import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleAssets: number;
  readonly allowedDeductions: number;
  readonly explicitRate: number;
  readonly applyThreshold: boolean;
  readonly threshold: number;
};
export type Output = {
  readonly netBase: number;
  readonly arithmeticAmount: number;
  readonly thresholdMet: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAssets: { type: "number", minimum: 0 },
    allowedDeductions: { type: "number", minimum: 0 },
    explicitRate: { type: "number", minimum: 0 },
    applyThreshold: { type: "boolean" },
    threshold: { type: "number", minimum: 0 },
  },
  required: [
    "eligibleAssets",
    "allowedDeductions",
    "explicitRate",
    "applyThreshold",
    "threshold",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netBase: { type: "number" },
    arithmeticAmount: { type: "number" },
    thresholdMet: { type: "boolean" },
  },
  required: ["netBase", "arithmeticAmount", "thresholdMet"],
} as const;
/** Arithmetic on caller-selected asset base, deductions, rate and threshold; no religious obligation, asset eligibility or calendar holding-period rule is determined. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    eligibleAssets,
    allowedDeductions,
    explicitRate,
    applyThreshold,
    threshold,
  } = request;
  const compute = (): Output => {
    H.domain(
      eligibleAssets >= 0 &&
        allowedDeductions >= 0 &&
        explicitRate >= 0 &&
        threshold >= 0,
    );
    return {
      netBase: Math.max(0, eligibleAssets - allowedDeductions),
      arithmeticAmount:
        applyThreshold &&
        Math.max(0, eligibleAssets - allowedDeductions) < threshold
          ? 0
          : Math.max(0, eligibleAssets - allowedDeductions) * explicitRate,
      thresholdMet:
        Math.max(0, eligibleAssets - allowedDeductions) >= threshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleAssets: 10000,
    allowedDeductions: 2000,
    explicitRate: 0.025,
    applyThreshold: true,
    threshold: 5000,
  },
  output: { netBase: 8000, arithmeticAmount: 200, thresholdMet: true },
} satisfies ToolExample<Input, Output>;
export const zakatExplicitRateAssetArithmeticTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/zakat-explicit-rate-asset-arithmetic",
    title: "Zakat Explicit Rate Asset Arithmetic Tool",
    description:
      "Arithmetic on caller-selected asset base, deductions, rate and threshold; no religious obligation, asset eligibility or calendar holding-period rule is determined.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAssets: { type: "number", minimum: 0 },
        allowedDeductions: { type: "number", minimum: 0 },
        explicitRate: { type: "number", minimum: 0 },
        applyThreshold: { type: "boolean" },
        threshold: { type: "number", minimum: 0 },
      },
      required: [
        "eligibleAssets",
        "allowedDeductions",
        "explicitRate",
        "applyThreshold",
        "threshold",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netBase: { type: "number" },
        arithmeticAmount: { type: "number" },
        thresholdMet: { type: "boolean" },
      },
      required: ["netBase", "arithmeticAmount", "thresholdMet"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleAssets",
          label: "Eligible Assets",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedDeductions",
          label: "Allowed Deductions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "explicitRate",
          label: "Explicit Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "applyThreshold",
          label: "Apply Threshold",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netBase", label: "Net Base", valueType: { type: "number" } },
        {
          id: "arithmeticAmount",
          label: "Arithmetic Amount",
          valueType: { type: "number" },
        },
        {
          id: "thresholdMet",
          label: "Threshold Met",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = zakatExplicitRateAssetArithmeticTool.execute;
export default zakatExplicitRateAssetArithmeticTool;
