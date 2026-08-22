import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const hydrationRatioTool = createSimpleTool({
  id: "cooking/hydration-ratio",
  title: "Hydration Ratio Calculator",
  description:
    "Calculate baker's hydration as the water weight expressed as a percentage of flour weight.",
  inputs: [
    {
      description: "Total water weight in the dough.",
      id: "waterGrams",
      label: "Water",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Total flour weight in the dough.",
      id: "flourGrams",
      label: "Flour",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Water weight as a percentage of flour weight.",
      id: "hydrationPercent",
      label: "Hydration",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const flourGrams = input.flourGrams as number;
    if (flourGrams <= 0)
      simpleError(
        "flourGrams",
        "The flour weight must be greater than zero grams.",
        "invalid_flour_weight",
      );
    return {
      hydrationPercent: ((input.waterGrams as number) / flourGrams) * 100,
    };
  },
});
export const runHydrationRatio = hydrationRatioTool.execute;
export default hydrationRatioTool;

export type HydrationRatioInput = {
  readonly waterGrams: number;
  readonly flourGrams: number;
};

export type HydrationRatioOutput = {
  readonly hydrationPercent: number;
};

export const hydrationRatioExample = {
  input: {
    waterGrams: 1,
    flourGrams: 1,
  },
  output: {
    hydrationPercent: 100,
  },
} satisfies ToolExample<HydrationRatioInput, HydrationRatioOutput>;
