import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TartaricAcidAdditionInput = {
  readonly currentTaGPerL: number;
  readonly targetTaGPerL: number;
  readonly volumeLiters: number;
};

export type TartaricAcidAdditionOutput = {
  readonly tartaricAcidGrams: number;
};

export const tartaricAcidAdditionExample = {
  input: {
    currentTaGPerL: 0.5,
    targetTaGPerL: 0.8,
    volumeLiters: 100,
  },
  output: {
    tartaricAcidGrams: 30,
  },
} satisfies ToolExample<TartaricAcidAdditionInput, TartaricAcidAdditionOutput>;

export const calculateTartaricAcidAddition = (
  input: TartaricAcidAdditionInput,
): TartaricAcidAdditionOutput => {
  if (input.targetTaGPerL < input.currentTaGPerL)
    simpleError(
      "targetTaGPerL",
      "The target titratable acidity must be at or above the current value for an addition.",
      "invalid_target",
    );
  return {
    tartaricAcidGrams: roundStatistic(
      (input.targetTaGPerL - input.currentTaGPerL) * input.volumeLiters,
    ),
  };
};

export const tartaricAcidAdditionTool = createSimpleTool({
  calculate: (input) =>
    calculateTartaricAcidAddition(
      input as unknown as TartaricAcidAdditionInput,
    ),
  description:
    "Calculate the tartaric acid grams needed to raise must or wine titratable acidity to the target.",
  id: "oenology/tartaric-acid-addition",
  inputs: [
    {
      description: "Measured titratable acidity as tartaric.",
      id: "currentTaGPerL",
      kind: "number",
      label: "Current TA",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Desired titratable acidity as tartaric.",
      id: "targetTaGPerL",
      kind: "number",
      label: "Target TA",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Volume of must or wine to treat.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Tartaric acid to dissolve into the lot.",
      id: "tartaricAcidGrams",
      kind: "number",
      label: "Tartaric acid",
      unit: "g",
    },
  ],
  title: "Acid Blend Tartaric Addition Calculator",
});
export const runTartaricAcidAddition = tartaricAcidAdditionTool.execute;
export default tartaricAcidAdditionTool;
