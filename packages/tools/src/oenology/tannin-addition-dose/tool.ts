import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TanninAdditionDoseInput = {
  readonly rateGPerHectoliter?: number;
  readonly volumeHectoliters: number;
};

export type TanninAdditionDoseOutput = {
  readonly productGrams: number;
};

export const tanninAdditionDoseExample = {
  input: {
    rateGPerHectoliter: 5,
    volumeHectoliters: 20,
  },
  output: {
    productGrams: 100,
  },
} satisfies ToolExample<TanninAdditionDoseInput, TanninAdditionDoseOutput>;

export const calculateTanninAdditionDose = (
  input: TanninAdditionDoseInput,
): TanninAdditionDoseOutput => {
  const rate = input.rateGPerHectoliter ?? 5;
  if (rate < 0)
    simpleError(
      "rateGPerHectoliter",
      "The tannin rate cannot be negative.",
      "invalid_value",
    );
  if (input.volumeHectoliters < 0)
    simpleError(
      "volumeHectoliters",
      "The treated volume cannot be negative.",
      "invalid_value",
    );
  return {
    productGrams: roundStatistic(rate * input.volumeHectoliters),
  };
};

export const tanninAdditionDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateTanninAdditionDose(input as unknown as TanninAdditionDoseInput),
  description:
    "Calculate the enological tannin grams needed to structure or protect a treated lot.",
  id: "oenology/tannin-addition-dose",
  inputs: [
    {
      default: 5,
      description: "Tannin rate per hectoliter of wine.",
      id: "rateGPerHectoliter",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description: "Wine volume to treat.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "hL",
    },
  ],
  outputs: [
    {
      description: "Tannin to add to the treated volume.",
      id: "productGrams",
      kind: "number",
      label: "Tannin",
      unit: "g",
    },
  ],
  title: "Tannin Addition Dose Calculator",
});
export const runTanninAdditionDose = tanninAdditionDoseTool.execute;
export default tanninAdditionDoseTool;
