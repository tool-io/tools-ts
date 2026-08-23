import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LastSurvivorAnnuityEpvInput = {
  readonly benefitAmount?: number;
  readonly firstLifeDeathProbability: number;
  readonly interestRate: number;
  readonly secondLifeDeathProbability: number;
};

export type LastSurvivorAnnuityEpvOutput = {
  readonly presentValue: number;
};

export const lastSurvivorAnnuityEpvExample = {
  input: {
    benefitAmount: 10,
    firstLifeDeathProbability: 0.5,
    interestRate: 0,
    secondLifeDeathProbability: 0.5,
  },
  output: {
    presentValue: 26.6666666667,
  },
} satisfies ToolExample<
  LastSurvivorAnnuityEpvInput,
  LastSurvivorAnnuityEpvOutput
>;

const guardedReciprocal = (
  factor: number,
  field: "firstLifeDeathProbability" | "secondLifeDeathProbability",
): number => {
  if (factor >= 1)
    simpleError(
      field,
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return 1 / (1 - factor);
};

export const calculateLastSurvivorAnnuityEpv = (
  input: LastSurvivorAnnuityEpvInput,
): LastSurvivorAnnuityEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const firstFactor = discount * (1 - input.firstLifeDeathProbability);
  const secondFactor = discount * (1 - input.secondLifeDeathProbability);
  const jointFactor =
    discount *
    (1 - input.firstLifeDeathProbability) *
    (1 - input.secondLifeDeathProbability);
  const value =
    guardedReciprocal(firstFactor, "firstLifeDeathProbability") +
    guardedReciprocal(secondFactor, "secondLifeDeathProbability") -
    guardedReciprocal(jointFactor, "firstLifeDeathProbability");
  return {
    presentValue: roundStatistic(value * (input.benefitAmount ?? 1)),
  };
};

export const lastSurvivorAnnuityEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateLastSurvivorAnnuityEpv(
      input as unknown as LastSurvivorAnnuityEpvInput,
    ),
  description:
    "Calculate the expected present value of an annuity-due that continues while at least one of two independent lives survives.",
  id: "actuarial/last-survivor-annuity-epv",
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
      description: "Expected present value of the last survivor annuity-due.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Last Survivor Annuity EPV Calculator",
});
export const runLastSurvivorAnnuityEpv = lastSurvivorAnnuityEpvTool.execute;
export default lastSurvivorAnnuityEpvTool;
