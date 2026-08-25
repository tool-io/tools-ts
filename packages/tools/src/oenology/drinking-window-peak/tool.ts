import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DrinkingWindowPeakInput = {
  readonly peakWindowYears: number;
  readonly vintageYear: number;
  readonly yearsToPeak: number;
};

export type DrinkingWindowPeakOutput = {
  readonly drinkFromYear: number;
  readonly drinkUntilYear: number;
};

export const drinkingWindowPeakExample = {
  input: {
    peakWindowYears: 5,
    vintageYear: 2018,
    yearsToPeak: 3,
  },
  output: {
    drinkFromYear: 2021,
    drinkUntilYear: 2026,
  },
} satisfies ToolExample<DrinkingWindowPeakInput, DrinkingWindowPeakOutput>;

export const calculateDrinkingWindow = (
  input: DrinkingWindowPeakInput,
): DrinkingWindowPeakOutput => {
  const start = input.vintageYear + input.yearsToPeak;
  return {
    drinkFromYear: start,
    drinkUntilYear: start + input.peakWindowYears,
  };
};

export const drinkingWindowPeakTool = createSimpleTool({
  calculate: (input) =>
    calculateDrinkingWindow(input as unknown as DrinkingWindowPeakInput),
  description:
    "Turn an externally assessed years-to-peak estimate and peak-window duration into calendar years; the calculator performs scheduling arithmetic rather than predicting wine development.",
  id: "oenology/drinking-window-peak",
  inputs: [
    {
      description: "Vintage printed on the label.",
      id: "vintageYear",
      kind: "integer",
      label: "Vintage",
      maximum: 3000,
      minimum: 0,
    },
    {
      description: "Years the wine stays at or near its peak.",
      id: "peakWindowYears",
      kind: "integer",
      label: "Peak window",
      minimum: 0,
      unit: "yr",
    },
    {
      description: "Years after harvest until the wine opens up.",
      id: "yearsToPeak",
      kind: "integer",
      label: "Years to peak",
      minimum: 0,
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "First calendar year of the peak window.",
      id: "drinkFromYear",
      kind: "integer",
      label: "Drink from",
    },
    {
      description: "Last calendar year of the peak window.",
      id: "drinkUntilYear",
      kind: "integer",
      label: "Drink until",
    },
  ],
  title: "Wine Drinking Window Calendar Calculator",
});
export const runDrinkingWindowPeak = drinkingWindowPeakTool.execute;
export default drinkingWindowPeakTool;
