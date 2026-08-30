import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FcrInput = Readonly<{
  readonly feedConsumedKilograms: number;
  readonly biomassGainKilograms: number;
}>;
export type FcrOutput = Readonly<{
  readonly feedConversionRatio: number;
}>;

export const calculateFcr = (x: FcrInput): FcrOutput => {
  if (!Number.isFinite(x.feedConsumedKilograms) || x.feedConsumedKilograms < 0)
    simpleError(
      "feedConsumedKilograms",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.biomassGainKilograms) || x.biomassGainKilograms <= 0)
    simpleError("biomassGainKilograms", "Provide a finite positive number.");
  const feedConversionRatio = x.feedConsumedKilograms / x.biomassGainKilograms;
  if (!Number.isFinite(feedConversionRatio))
    simpleError(
      "feedConversionRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    feedConversionRatio: Object.is(feedConversionRatio, -0)
      ? 0
      : feedConversionRatio,
  };
};

export const example = {
  input: {
    feedConsumedKilograms: 1200,
    biomassGainKilograms: 1000,
  },
  output: { feedConversionRatio: 1.2 },
} satisfies ToolExample<FcrInput, FcrOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/fcr",
  title: "FCR",
  description:
    "Calculate apparent feed conversion ratio as feed consumed divided by wet biomass gain; natural food can affect interpretation.",
  inputs: [
    {
      id: "feedConsumedKilograms",
      kind: "number",
      label: "Feed Consumed Kilograms",
      unit: "kg",
    },
    {
      id: "biomassGainKilograms",
      kind: "number",
      label: "Biomass Gain Kilograms",
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "feedConversionRatio",
      kind: "number",
      label: "Feed Conversion Ratio",
      unit: "kg/kg",
    },
  ],
  calculate: (input) =>
    calculateFcr({
      feedConsumedKilograms: input.feedConsumedKilograms as number,
      biomassGainKilograms: input.biomassGainKilograms as number,
    }),
});
export const runFcr = tool.execute;
export default tool;
