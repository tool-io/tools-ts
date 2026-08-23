import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ReversionaryAnnuityEpvInput = {
  readonly benefitAmount?: number;
  readonly firstLifeDeathProbability: number;
  readonly interestRate: number;
  readonly secondLifeDeathProbability: number;
};

export type ReversionaryAnnuityEpvOutput = {
  readonly presentValue: number;
};

export const reversionaryAnnuityEpvExample = {
  input: {
    benefitAmount: 10,
    firstLifeDeathProbability: 0.5,
    interestRate: 0,
    secondLifeDeathProbability: 0.5,
  },
  output: {
    presentValue: 6.66666666667,
  },
} satisfies ToolExample<
  ReversionaryAnnuityEpvInput,
  ReversionaryAnnuityEpvOutput
>;

export const calculateReversionaryAnnuityEpv = (
  input: ReversionaryAnnuityEpvInput,
): ReversionaryAnnuityEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const secondFactor = discount * (1 - input.secondLifeDeathProbability);
  const jointFactor =
    discount *
    (1 - input.firstLifeDeathProbability) *
    (1 - input.secondLifeDeathProbability);
  if (secondFactor >= 1 || jointFactor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  const value = 1 / (1 - secondFactor) - 1 / (1 - jointFactor);
  return {
    presentValue: roundStatistic(value * (input.benefitAmount ?? 1)),
  };
};

export const reversionaryAnnuityEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateReversionaryAnnuityEpv(
      input as unknown as ReversionaryAnnuityEpvInput,
    ),
  description:
    "Calculate the expected present value of an annuity payable while the second life survives after the first life has died, assuming independent lives.",
  id: "actuarial/reversionary-annuity-epv",
  inputs: [
    {
      default: 1,
      description:
        "Payment made at the start of each year the second life is alive after the first life has died.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description: "Annual death probability of the first life.",
      id: "firstLifeDeathProbability",
      kind: "number",
      label: "First life death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Annual effective interest rate used for discounting.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: 0,
    },
    {
      description: "Annual death probability of the second life.",
      id: "secondLifeDeathProbability",
      kind: "number",
      label: "Second life death probability",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the reversionary annuity.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Reversionary Annuity EPV Calculator",
});
export const runReversionaryAnnuityEpv = reversionaryAnnuityEpvTool.execute;
export default reversionaryAnnuityEpvTool;
