import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type JointLifeAnnuityEpvInput = {
  readonly benefitAmount?: number;
  readonly firstLifeDeathProbability: number;
  readonly interestRate: number;
  readonly secondLifeDeathProbability: number;
};

export type JointLifeAnnuityEpvOutput = {
  readonly presentValue: number;
};

export const jointLifeAnnuityEpvExample = {
  input: {
    benefitAmount: 10,
    firstLifeDeathProbability: 0.5,
    interestRate: 0,
    secondLifeDeathProbability: 0.5,
  },
  output: {
    presentValue: 13.3333333333,
  },
} satisfies ToolExample<JointLifeAnnuityEpvInput, JointLifeAnnuityEpvOutput>;

export const calculateJointLifeAnnuityEpv = (
  input: JointLifeAnnuityEpvInput,
): JointLifeAnnuityEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const factor =
    discount *
    (1 - input.firstLifeDeathProbability) *
    (1 - input.secondLifeDeathProbability);
  if (factor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return {
    presentValue: roundStatistic((input.benefitAmount ?? 1) / (1 - factor)),
  };
};

export const jointLifeAnnuityEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateJointLifeAnnuityEpv(input as unknown as JointLifeAnnuityEpvInput),
  description:
    "Calculate the expected present value of an annuity-due that continues while both independent lives survive.",
  id: "actuarial/joint-life-annuity-epv",
  inputs: [
    {
      default: 1,
      description: "Payment made at the start of each survived year.",
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
      description: "Expected present value of the joint life annuity-due.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Joint Life Annuity EPV Calculator",
});
export const runJointLifeAnnuityEpv = jointLifeAnnuityEpvTool.execute;
export default jointLifeAnnuityEpvTool;
