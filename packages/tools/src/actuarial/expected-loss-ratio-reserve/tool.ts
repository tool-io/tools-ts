import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ExpectedLossRatioReserveInput = {
  readonly earnedPremium: number;
  readonly expectedLossRatioPercent: number;
  readonly reportedIncurredLosses: number;
};

export type ExpectedLossRatioReserveOutput = {
  readonly unreportedLossEstimate: number;
};

export const expectedLossRatioReserveExample = {
  input: {
    earnedPremium: 1000000,
    expectedLossRatioPercent: 60,
    reportedIncurredLosses: 450000,
  },
  output: {
    unreportedLossEstimate: 150000,
  },
} satisfies ToolExample<
  ExpectedLossRatioReserveInput,
  ExpectedLossRatioReserveOutput
>;

export const calculateExpectedLossRatioReserve = (
  input: ExpectedLossRatioReserveInput,
): ExpectedLossRatioReserveOutput => {
  return {
    unreportedLossEstimate:
      input.earnedPremium * (input.expectedLossRatioPercent / 100) -
      input.reportedIncurredLosses,
  };
};

export const expectedLossRatioReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateExpectedLossRatioReserve({
      earnedPremium: input.earnedPremium as number,
      expectedLossRatioPercent: input.expectedLossRatioPercent as number,
      reportedIncurredLosses: input.reportedIncurredLosses as number,
    }),
  description:
    "Estimate unreported losses by subtracting reported incurred losses from expected ultimate losses implied by an expected loss ratio.",
  id: "actuarial/expected-loss-ratio-reserve",
  inputs: [
    {
      description: "Premium earned over the exposure period.",
      id: "earnedPremium",
      kind: "number",
      label: "Earned premium",
      minimum: 0,
    },
    {
      description:
        "Expected ultimate loss ratio for the book; may exceed 100 percent for unprofitable books.",
      id: "expectedLossRatioPercent",
      kind: "number",
      label: "Expected loss ratio",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Losses reported and case-reserved to date.",
      id: "reportedIncurredLosses",
      kind: "number",
      label: "Reported incurred losses",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Unreported reserve implied by the expected loss ratio; negative when reported losses already exceed the expected ultimate.",
      id: "unreportedLossEstimate",
      kind: "number",
      label: "Unreported loss estimate",
    },
  ],
  title: "Expected Loss Ratio IBNR Calculator",
});
export const runExpectedLossRatioReserve = expectedLossRatioReserveTool.execute;
export default expectedLossRatioReserveTool;
