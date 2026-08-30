import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnderinsuredCoverageRatioCheckerInput = Readonly<{
  readonly insuranceLimit: number;
  readonly collectionValue: number;
}>;
export type UnderinsuredCoverageRatioCheckerOutput = Readonly<{
  readonly coveragePercent: number;
}>;

export const calculateUnderinsuredCoverageRatioChecker = (
  x: UnderinsuredCoverageRatioCheckerInput,
): UnderinsuredCoverageRatioCheckerOutput => {
  if (!Number.isFinite(x.insuranceLimit) || x.insuranceLimit < 0)
    simpleError("insuranceLimit", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.collectionValue) || x.collectionValue <= 0)
    simpleError("collectionValue", "Provide a finite positive number.");
  const coveragePercent = (x.insuranceLimit / x.collectionValue) * 100;
  if (!Number.isFinite(coveragePercent))
    simpleError(
      "coveragePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    coveragePercent: Object.is(coveragePercent, -0) ? 0 : coveragePercent,
  };
};

export const example = {
  input: {
    insuranceLimit: 800,
    collectionValue: 1000,
  },
  output: { coveragePercent: 80 },
} satisfies ToolExample<
  UnderinsuredCoverageRatioCheckerInput,
  UnderinsuredCoverageRatioCheckerOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/underinsured-coverage-ratio-checker",
  title: "Underinsured Coverage Ratio Checker",
  description:
    "Compare policy limit with a supplied collection valuation; exclusions and deductibles are not modeled.",
  inputs: [
    {
      id: "insuranceLimit",
      kind: "number",
      label: "Insurance Limit",
      unit: "currency",
    },
    {
      id: "collectionValue",
      kind: "number",
      label: "Collection Value",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "coveragePercent",
      kind: "number",
      label: "Coverage Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateUnderinsuredCoverageRatioChecker({
      insuranceLimit: input.insuranceLimit as number,
      collectionValue: input.collectionValue as number,
    }),
});
export const runUnderinsuredCoverageRatioChecker = tool.execute;
export default tool;
