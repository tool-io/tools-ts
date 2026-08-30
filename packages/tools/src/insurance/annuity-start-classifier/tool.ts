import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for annuity start classifier while preserving mixed and insufficient evidence.",
  example: {
    incomeStartsWithinYear: true,
    singlePremiumIncome: true,
    accumulationPeriod: false,
    incomeStartsAfterYear: false,
  },
  first: { value: "immediate-annuity", label: "Immediate-annuity indicators" },
  id: "insurance/annuity-start-classifier",
  indicators: [
    {
      id: "incomeStartsWithinYear",
      label: "Income starts within one year",
      side: "first",
    },
    {
      id: "singlePremiumIncome",
      label: "Premium is converted promptly to income",
      side: "first",
    },
    {
      id: "accumulationPeriod",
      label: "Contract has an accumulation period",
      side: "second",
    },
    {
      id: "incomeStartsAfterYear",
      label: "Income starts after one year",
      side: "second",
    },
  ],
  second: { value: "deferred-annuity", label: "Deferred-annuity indicators" },
  title: "Annuity Start Classifier",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
