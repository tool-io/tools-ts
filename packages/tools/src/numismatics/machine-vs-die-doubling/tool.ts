import { createTwoWayClassifier } from "../../core/operational.js";

const operation = createTwoWayClassifier({
  description:
    "Classify caller-observed indicators for machine vs. die doubling while preserving mixed and insufficient evidence.",
  example: {
    flatShelf: true,
    reducedDeviceWidth: true,
    raisedSeparatedImage: false,
    repeatsAcrossCoins: false,
  },
  first: { value: "machine-doubling", label: "Machine-doubling indicators" },
  id: "numismatics/machine-vs-die-doubling",
  indicators: [
    { id: "flatShelf", label: "Flat shelf-like doubling", side: "first" },
    { id: "reducedDeviceWidth", label: "Reduced device width", side: "first" },
    {
      id: "raisedSeparatedImage",
      label: "Raised separated image",
      side: "second",
    },
    { id: "repeatsAcrossCoins", label: "Repeats across coins", side: "second" },
  ],
  second: { value: "doubled-die", label: "Doubled-die indicators" },
  title: "Machine vs. Die Doubling",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
