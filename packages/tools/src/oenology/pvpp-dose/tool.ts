import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PvppDoseInput = {
  readonly rateGPerHectoliter?: number;
  readonly volumeHectoliters: number;
};

export type PvppDoseOutput = {
  readonly productGrams: number;
};

export const pvppDoseExample = {
  input: {
    rateGPerHectoliter: 30,
    volumeHectoliters: 20,
  },
  output: {
    productGrams: 600,
  },
} satisfies ToolExample<PvppDoseInput, PvppDoseOutput>;

export const calculatePvppDose = (input: PvppDoseInput): PvppDoseOutput => {
  const rate = input.rateGPerHectoliter ?? 30;
  if (rate < 0)
    simpleError(
      "rateGPerHectoliter",
      "The fining rate cannot be negative.",
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

export const pvppDoseTool = createSimpleTool({
  calculate: (input) => calculatePvppDose(input as unknown as PvppDoseInput),
  description:
    "Calculate the PVPP grams needed to bind browning phenolics in a treated lot.",
  id: "oenology/pvpp-dose",
  inputs: [
    {
      default: 30,
      description: "PVPP rate per hectoliter of wine.",
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
      description: "PVPP to add to the treated volume.",
      id: "productGrams",
      kind: "number",
      label: "PVPP",
      unit: "g",
    },
  ],
  title: "PVPP Dose Calculator",
});
export const runPvppDose = pvppDoseTool.execute;
export default pvppDoseTool;
