import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MlfInoculationRateInput = {
  readonly rateGramsPerHectoliter: number;
  readonly volumeHectoliters: number;
};

export type MlfInoculationRateOutput = {
  readonly bacteriaGrams: number;
};

export const mlfInoculationRateExample = {
  input: {
    rateGramsPerHectoliter: 1,
    volumeHectoliters: 50,
  },
  output: {
    bacteriaGrams: 50,
  },
} satisfies ToolExample<MlfInoculationRateInput, MlfInoculationRateOutput>;

export const calculateMlfInoculationRate = (
  input: MlfInoculationRateInput,
): MlfInoculationRateOutput => {
  return {
    bacteriaGrams: roundStatistic(
      input.rateGramsPerHectoliter * input.volumeHectoliters,
    ),
  };
};

export const mlfInoculationRateTool = createSimpleTool({
  calculate: (input) =>
    calculateMlfInoculationRate(input as unknown as MlfInoculationRateInput),
  description:
    "Convert the manufacturer-specified mass rate for a particular malolactic culture into total product mass for the selected wine volume.",
  id: "oenology/mlf-inoculation-rate",
  inputs: [
    {
      description:
        "Product dose specified per hectoliter for the selected culture.",
      id: "rateGramsPerHectoliter",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description: "Wine volume to inoculate.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Wine volume",
      minimum: 0,
      unit: "hL",
    },
  ],
  outputs: [
    {
      description: "Malolactic culture to weigh out.",
      id: "bacteriaGrams",
      kind: "number",
      label: "Bacteria",
      unit: "g",
    },
  ],
  title: "MLF Inoculation Rate Calculator",
});
export const runMlfInoculationRate = mlfInoculationRateTool.execute;
export default mlfInoculationRateTool;
