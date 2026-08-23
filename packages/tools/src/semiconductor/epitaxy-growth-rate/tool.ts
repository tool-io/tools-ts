import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EpitaxyGrowthRateInput = {
  readonly growthTimeMinutes: number;
  readonly layerThicknessUm: number;
};

export type EpitaxyGrowthRateOutput = {
  readonly growthUmPerMinute: number;
};

export const epitaxyGrowthRateExample = {
  input: { growthTimeMinutes: 20, layerThicknessUm: 2 },
  output: { growthUmPerMinute: 0.1 },
} satisfies ToolExample<EpitaxyGrowthRateInput, EpitaxyGrowthRateOutput>;

export const calculateEpitaxyGrowthRate = (
  input: EpitaxyGrowthRateInput,
): EpitaxyGrowthRateOutput => {
  if (!Number.isFinite(input.layerThicknessUm) || input.layerThicknessUm < 0)
    simpleError(
      "layerThicknessUm",
      "Layer thickness must be a finite number at least 0.",
      "invalid_layer_thickness",
    );
  if (!Number.isFinite(input.growthTimeMinutes) || input.growthTimeMinutes <= 0)
    simpleError(
      "growthTimeMinutes",
      "Growth time must be a finite positive number.",
      "invalid_growth_time",
    );
  const growthUmPerMinute =
    input.layerThicknessUm === 0
      ? 0
      : input.layerThicknessUm / input.growthTimeMinutes;
  if (
    !Number.isFinite(growthUmPerMinute) ||
    (input.layerThicknessUm > 0 && growthUmPerMinute === 0)
  )
    simpleError(
      "growthTimeMinutes",
      "Growth rate is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    growthUmPerMinute,
  };
};

export const epitaxyGrowthRateTool = createSimpleTool({
  calculate: (input) =>
    calculateEpitaxyGrowthRate({
      growthTimeMinutes: input.growthTimeMinutes as number,
      layerThicknessUm: input.layerThicknessUm as number,
    }),
  description:
    "Divide the grown epitaxial layer thickness (final minus initial) by the deposition time to get the average epitaxy growth rate.",
  id: "semiconductor/epitaxy-growth-rate",
  inputs: [
    {
      description:
        "Thickness of the grown epitaxial layer. Must be at least 0 µm; 0 yields 0 µm/min.",
      format: "length",
      id: "layerThicknessUm",
      kind: "number",
      label: "Layer thickness",
      minimum: 0,
      unit: "um",
    },
    {
      description: "Total epitaxy deposition time. Must be greater than 0 min.",
      format: "duration",
      id: "growthTimeMinutes",
      kind: "number",
      label: "Growth time",
      minimum: Number.MIN_VALUE,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Average epitaxial growth rate over the measured interval.",
      format: "rate",
      id: "growthUmPerMinute",
      kind: "number",
      label: "Growth rate",
      minimum: 0,
      unit: "um/min",
    },
  ],
  title: "Epitaxy Growth Rate Calculator",
});
export const runEpitaxyGrowthRate = epitaxyGrowthRateTool.execute;
export default epitaxyGrowthRateTool;
