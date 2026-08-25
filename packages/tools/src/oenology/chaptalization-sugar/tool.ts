import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ChaptalizationSugarInput = {
  readonly currentBrix: number;
  readonly targetPotentialAlcoholPercent: number;
  readonly volumeLiters: number;
};

export type ChaptalizationSugarOutput = {
  readonly sugarKilograms: number;
};

export const chaptalizationSugarExample = {
  input: {
    currentBrix: 18,
    targetPotentialAlcoholPercent: 13,
    volumeLiters: 100,
  },
  output: {
    sugarKilograms: 4.03389830508,
  },
} satisfies ToolExample<ChaptalizationSugarInput, ChaptalizationSugarOutput>;

export const calculateChaptalizationSugar = (
  input: ChaptalizationSugarInput,
): ChaptalizationSugarOutput => {
  const targetBrix = input.targetPotentialAlcoholPercent / 0.59;
  if (targetBrix <= input.currentBrix)
    simpleError(
      "targetPotentialAlcoholPercent",
      "The target potential alcohol must exceed what the current Brix already provides.",
      "invalid_target",
    );
  const gramsPerLiter = (targetBrix - input.currentBrix) * 10;
  return {
    sugarKilograms: roundStatistic((gramsPerLiter * input.volumeLiters) / 1000),
  };
};

export const chaptalizationSugarTool = createSimpleTool({
  calculate: (input) =>
    calculateChaptalizationSugar(input as unknown as ChaptalizationSugarInput),
  description:
    "Estimate sucrose needed to raise must from measured Brix to a target potential alcohol using 0.59% potential ABV per °Bx and 10 g/L sugar per added °Bx; volume change and non-sugar extract are ignored.",
  id: "oenology/chaptalization-sugar",
  inputs: [
    {
      description: "Measured dissolved sugar in degrees Brix.",
      id: "currentBrix",
      kind: "number",
      label: "Current Brix",
      maximum: 100,
      minimum: 0,
      unit: "°Bx",
    },
    {
      description: "Desired potential alcohol after full fermentation.",
      id: "targetPotentialAlcoholPercent",
      kind: "number",
      label: "Target potential alcohol",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Must volume to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Cane sugar to dissolve into the must.",
      id: "sugarKilograms",
      kind: "number",
      label: "Sugar",
      unit: "kg",
    },
  ],
  title: "Chaptalization Sugar Requirement Calculator",
});
export const runChaptalizationSugar = chaptalizationSugarTool.execute;
export default chaptalizationSugarTool;
