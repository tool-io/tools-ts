import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for doubled die vs. double strike while preserving mixed and insufficient evidence.",
  example: {
    repeatsAcrossCoins: true,
    raisedRoundedDoubling: true,
    wholeDesignDisplaced: false,
    secondStrikeOverlap: false,
  },
  first: { value: "doubled-die", label: "Doubled-die indicators" },
  id: "numismatics/doubled-die-vs-double-strike",
  indicators: [
    { id: "repeatsAcrossCoins", label: "Repeats across coins", side: "first" },
    {
      id: "raisedRoundedDoubling",
      label: "Raised rounded doubling",
      side: "first",
    },
    {
      id: "wholeDesignDisplaced",
      label: "Whole design displaced",
      side: "second",
    },
    {
      id: "secondStrikeOverlap",
      label: "Second-strike overlap",
      side: "second",
    },
  ],
  second: { value: "double-struck", label: "Double-strike indicators" },
  title: "Doubled Die vs. Double Strike",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
