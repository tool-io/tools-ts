import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OverfallsRiskFactorInput = {
  readonly springRangeMeters: number;
  readonly depthMeters: number;
  readonly maximumRateKt: number;
};

export type OverfallsRiskFactorOutput = {
  readonly overfallsRiskFactor: number;
};

export const overfallsRiskFactorExample = {
  input: { depthMeters: 20, maximumRateKt: 4, springRangeMeters: 5 },
  output: { overfallsRiskFactor: 1 },
} satisfies ToolExample<OverfallsRiskFactorInput, OverfallsRiskFactorOutput>;

export const calculateOverfallsRiskFactor = (
  input: OverfallsRiskFactorInput,
): OverfallsRiskFactorOutput => {
  if (!(input.springRangeMeters > 0))
    simpleError(
      "springRangeMeters",
      "The spring range must be positive.",
      "invalid_range",
    );
  if (!(input.maximumRateKt > 0))
    simpleError(
      "maximumRateKt",
      "The maximum stream rate must be positive.",
      "invalid_rate",
    );
  if (!(input.depthMeters > 0))
    simpleError(
      "depthMeters",
      "The water depth must be positive.",
      "invalid_depth",
    );
  return {
    overfallsRiskFactor:
      (input.springRangeMeters * input.maximumRateKt) / input.depthMeters,
  };
};

export const overfallsRiskFactorTool = createSimpleTool({
  id: "sailing/overfalls-risk-factor",
  title: "Overfalls Risk Factor",
  description:
    "Estimate the severity of overfalls from the spring tidal range, maximum stream rate, and water depth.",
  inputs: [
    {
      description: "Spring tidal range at the location.",
      id: "springRangeMeters",
      kind: "number",
      label: "Spring range",
      unit: "m",
    },
    {
      description: "Fastest tidal stream rate expected.",
      id: "maximumRateKt",
      kind: "number",
      label: "Maximum rate",
      unit: "kt",
    },
    {
      description: "Water depth over the shallows.",
      id: "depthMeters",
      kind: "number",
      label: "Depth",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Dimensionless indicator of overfall severity.",
      format: "ratio",
      id: "overfallsRiskFactor",
      kind: "number",
      label: "Overfalls risk factor",
    },
  ],
  calculate: (input) =>
    calculateOverfallsRiskFactor(input as unknown as OverfallsRiskFactorInput),
});

export const runOverfallsRiskFactor = overfallsRiskFactorTool.execute;
export default overfallsRiskFactorTool;
