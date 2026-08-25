import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type EggWhiteFiningDoseInput = {
  readonly barrelVolumeLiters: number;
  readonly volumeLiters: number;
  readonly whitesPerBarrel: number;
};

export type EggWhiteFiningDoseOutput = {
  readonly eggWhiteEquivalent: number;
  readonly eggWhiteCount: number;
};

export const eggWhiteFiningDoseExample = {
  input: {
    barrelVolumeLiters: 225,
    volumeLiters: 900,
    whitesPerBarrel: 4,
  },
  output: {
    eggWhiteEquivalent: 16,
    eggWhiteCount: 16,
  },
} satisfies ToolExample<EggWhiteFiningDoseInput, EggWhiteFiningDoseOutput>;

export const calculateEggWhiteFiningDose = (
  input: EggWhiteFiningDoseInput,
): EggWhiteFiningDoseOutput => {
  const barrelVolume = input.barrelVolumeLiters;
  if (barrelVolume <= 0)
    simpleError(
      "barrelVolumeLiters",
      "The barrel volume must be positive.",
      "invalid_value",
    );
  const barrels = input.volumeLiters / barrelVolume;
  const eggWhiteEquivalent = barrels * input.whitesPerBarrel;
  return {
    eggWhiteEquivalent: roundStatistic(eggWhiteEquivalent),
    eggWhiteCount: Math.ceil(eggWhiteEquivalent),
  };
};

export const eggWhiteFiningDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateEggWhiteFiningDose(input as unknown as EggWhiteFiningDoseInput),
  description:
    "Convert a bench-trial egg-white rate per reference barrel into an exact equivalent and a rounded-up whole-egg count for the selected wine volume.",
  id: "oenology/egg-white-fining-dose",
  inputs: [
    {
      description: "Barrel size used for the per-barrel rate.",
      id: "barrelVolumeLiters",
      kind: "number",
      label: "Barrel volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Wine volume to fine.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Bench-trial egg-white rate per reference barrel.",
      id: "whitesPerBarrel",
      kind: "number",
      label: "Whites per barrel",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Exact egg-white equivalent before whole-egg rounding.",
      id: "eggWhiteEquivalent",
      kind: "number",
      label: "Egg-white equivalent",
    },
    {
      description: "Whole egg whites after rounding the equivalent upward.",
      id: "eggWhiteCount",
      kind: "integer",
      label: "Egg whites",
    },
  ],
  title: "Egg White Fining Dose Calculator",
});
export const runEggWhiteFiningDose = eggWhiteFiningDoseTool.execute;
export default eggWhiteFiningDoseTool;
