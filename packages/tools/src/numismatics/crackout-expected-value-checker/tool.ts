import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrackoutExpectedValueCheckerInput = Readonly<{
  readonly upgradeProbabilityPercent: number;
  readonly upgradedSalePrice: number;
  readonly failedSalePrice: number;
  readonly currentSalePrice: number;
  readonly gradingAndShippingCost: number;
}>;
export type CrackoutExpectedValueCheckerOutput = Readonly<{
  readonly expectedNetGain: number;
}>;

export const calculateCrackoutExpectedValueChecker = (
  x: CrackoutExpectedValueCheckerInput,
): CrackoutExpectedValueCheckerOutput => {
  if (
    !Number.isFinite(x.upgradeProbabilityPercent) ||
    x.upgradeProbabilityPercent < 0 ||
    x.upgradeProbabilityPercent > 100
  )
    simpleError(
      "upgradeProbabilityPercent",
      "Provide a finite nonnegative number no greater than 100.",
    );
  if (!Number.isFinite(x.upgradedSalePrice) || x.upgradedSalePrice < 0)
    simpleError("upgradedSalePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.failedSalePrice) || x.failedSalePrice < 0)
    simpleError("failedSalePrice", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.currentSalePrice) || x.currentSalePrice < 0)
    simpleError("currentSalePrice", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.gradingAndShippingCost) ||
    x.gradingAndShippingCost < 0
  )
    simpleError(
      "gradingAndShippingCost",
      "Provide a finite nonnegative number.",
    );
  const expectedNetGain =
    (x.upgradeProbabilityPercent / 100) * x.upgradedSalePrice +
    (1 - x.upgradeProbabilityPercent / 100) * x.failedSalePrice -
    x.currentSalePrice -
    x.gradingAndShippingCost;
  if (!Number.isFinite(expectedNetGain))
    simpleError(
      "expectedNetGain",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    expectedNetGain: Object.is(expectedNetGain, -0) ? 0 : expectedNetGain,
  };
};

export const example = {
  input: {
    upgradeProbabilityPercent: 25,
    upgradedSalePrice: 200,
    failedSalePrice: 80,
    currentSalePrice: 100,
    gradingAndShippingCost: 20,
  },
  output: { expectedNetGain: -10 },
} satisfies ToolExample<
  CrackoutExpectedValueCheckerInput,
  CrackoutExpectedValueCheckerOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/crackout-expected-value-checker",
  title: "Crackout Expected Value Checker",
  description:
    "Estimate expected net gain of resubmission from user-supplied outcome prices and upgrade probability; no grading outcome is predicted.",
  inputs: [
    {
      id: "upgradeProbabilityPercent",
      kind: "number",
      label: "Upgrade Probability Percent",
      unit: "%",
    },
    {
      id: "upgradedSalePrice",
      kind: "number",
      label: "Upgraded Sale Price",
      unit: "currency",
    },
    {
      id: "failedSalePrice",
      kind: "number",
      label: "Failed Sale Price",
      unit: "currency",
    },
    {
      id: "currentSalePrice",
      kind: "number",
      label: "Current Sale Price",
      unit: "currency",
    },
    {
      id: "gradingAndShippingCost",
      kind: "number",
      label: "Grading And Shipping Cost",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "expectedNetGain",
      kind: "number",
      label: "Expected Net Gain",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateCrackoutExpectedValueChecker({
      upgradeProbabilityPercent: input.upgradeProbabilityPercent as number,
      upgradedSalePrice: input.upgradedSalePrice as number,
      failedSalePrice: input.failedSalePrice as number,
      currentSalePrice: input.currentSalePrice as number,
      gradingAndShippingCost: input.gradingAndShippingCost as number,
    }),
});
export const runCrackoutExpectedValueChecker = tool.execute;
export default tool;
