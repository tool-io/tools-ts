import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LoadFactorWeightUtilizationPercentInput = {
  readonly loadedWeightLbs: number;
  readonly maxPayloadWeightLbs: number;
};

export type LoadFactorWeightUtilizationPercentOutput = {
  readonly loadFactorPercent: number;
};

export const calculateLoadFactorWeightUtilizationPercent = (
  input: LoadFactorWeightUtilizationPercentInput,
): LoadFactorWeightUtilizationPercentOutput => {
  if (
    !Number.isFinite(input.maxPayloadWeightLbs) ||
    input.maxPayloadWeightLbs <= 0
  )
    return simpleError(
      "maxPayloadWeightLbs",
      "Maximum payload weight must be finite and greater than zero.",
      "invalid_payload",
    );
  if (!Number.isFinite(input.loadedWeightLbs) || input.loadedWeightLbs < 0)
    return simpleError(
      "loadedWeightLbs",
      "Loaded weight must be finite and non-negative.",
      "invalid_loaded_weight",
    );
  const loadFactorPercent =
    input.loadedWeightLbs === 0
      ? 0
      : (input.loadedWeightLbs / input.maxPayloadWeightLbs) * 100;
  if (!Number.isFinite(loadFactorPercent))
    return simpleError(
      "loadedWeightLbs",
      "Load factor is too large to represent.",
      "result_out_of_range",
    );
  return {
    loadFactorPercent,
  };
};

export const loadFactorWeightUtilizationPercentExample = {
  input: { loadedWeightLbs: 36000, maxPayloadWeightLbs: 45000 },
  output: { loadFactorPercent: 80 },
} satisfies ToolExample<
  LoadFactorWeightUtilizationPercentInput,
  LoadFactorWeightUtilizationPercentOutput
>;

export const loadFactorWeightUtilizationPercentTool = createSimpleTool({
  id: "logistics/load-factor-weight-utilization-percent",
  title: "Load Factor Weight Utilization Percent Calculator",
  description:
    "Compute vehicle weight utilization as loaded freight weight over the maximum payload capacity.",
  inputs: [
    {
      description: "Freight weight actually carried in pounds.",
      id: "loadedWeightLbs",
      kind: "number",
      label: "Loaded weight",
      minimum: 0,
      unit: "lb",
    },
    {
      description: "Maximum payload capacity in pounds.",
      id: "maxPayloadWeightLbs",
      kind: "number",
      label: "Max payload",
      minimum: Number.MIN_VALUE,
      unit: "lb",
    },
  ],
  outputs: [
    {
      description:
        "Loaded weight as a percent of maximum payload; values above 100 indicate an overload relative to the supplied capacity.",
      id: "loadFactorPercent",
      kind: "number",
      label: "Load factor",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateLoadFactorWeightUtilizationPercent({
      loadedWeightLbs: input.loadedWeightLbs as number,
      maxPayloadWeightLbs: input.maxPayloadWeightLbs as number,
    }),
});

export const runLoadFactorWeightUtilizationPercent =
  loadFactorWeightUtilizationPercentTool.execute;
export default loadFactorWeightUtilizationPercentTool;
