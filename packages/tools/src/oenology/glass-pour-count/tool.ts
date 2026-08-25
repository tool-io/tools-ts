import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type GlassPourCountInput = {
  readonly bottleMl?: number;
  readonly pourMl?: number;
};

export type GlassPourCountOutput = {
  readonly poursPerBottle: number;
  readonly wholePours: number;
};

export const glassPourCountExample = {
  input: {
    bottleMl: 750,
    pourMl: 125,
  },
  output: {
    poursPerBottle: 6,
    wholePours: 6,
  },
} satisfies ToolExample<GlassPourCountInput, GlassPourCountOutput>;

export const calculateGlassPourCount = (
  input: GlassPourCountInput,
): GlassPourCountOutput => {
  const pour = input.pourMl ?? 125;
  if (pour <= 0)
    simpleError("pourMl", "The pour size must be positive.", "invalid_value");
  const pourEquivalent = (input.bottleMl ?? 750) / pour;
  return {
    poursPerBottle: roundStatistic(pourEquivalent),
    wholePours: Math.floor(pourEquivalent),
  };
};

export const glassPourCountTool = createSimpleTool({
  calculate: (input) =>
    calculateGlassPourCount(input as unknown as GlassPourCountInput),
  description:
    "Divide a bottle into tasting or restaurant pour sizes to see how many glasses it yields.",
  id: "oenology/glass-pour-count",
  inputs: [
    {
      default: 750,
      description: "Full bottle volume.",
      id: "bottleMl",
      kind: "number",
      label: "Bottle size",
      minimum: 0,
      unit: "mL",
    },
    {
      default: 125,
      description: "Volume served in each glass.",
      id: "pourMl",
      kind: "number",
      label: "Pour size",
      minimum: 0,
      unit: "mL",
    },
  ],
  outputs: [
    {
      description: "Exact pour equivalent, including a fractional final pour.",
      id: "poursPerBottle",
      kind: "number",
      label: "Pours per bottle",
    },
    {
      description: "Whole pours that can be served at the selected volume.",
      id: "wholePours",
      kind: "integer",
      label: "Whole pours",
    },
  ],
  title: "Glass Pour Portion Count Calculator",
});
export const runGlassPourCount = glassPourCountTool.execute;
export default glassPourCountTool;
