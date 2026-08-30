import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HairspringBreathingGeometryInput = {
  readonly meanDiameterMillimeters: number;
  readonly radialExcursionMillimeters: number;
};

export type HairspringBreathingGeometryOutput = {
  readonly diameterExcursionMillimeters: number;
  readonly excursionRatio: number;
  readonly maximumDiameterMillimeters: number;
  readonly minimumDiameterMillimeters: number;
};

export const calculateHairspringBreathingGeometry = (
  input: HairspringBreathingGeometryInput,
): HairspringBreathingGeometryOutput => {
  if (
    !Number.isFinite(input.meanDiameterMillimeters) ||
    input.meanDiameterMillimeters <= 0
  )
    simpleError(
      "meanDiameterMillimeters",
      "Mean spring diameter must be finite and positive.",
      "mean_diameter_invalid",
    );
  if (
    !Number.isFinite(input.radialExcursionMillimeters) ||
    input.radialExcursionMillimeters < 0
  )
    simpleError(
      "radialExcursionMillimeters",
      "Radial excursion must be finite and nonnegative.",
      "radial_excursion_invalid",
    );
  if (2 * input.radialExcursionMillimeters >= input.meanDiameterMillimeters)
    simpleError(
      "radialExcursionMillimeters",
      "Radial excursion would make the spring diameter zero or negative.",
      "nonpositive_minimum_diameter",
    );
  return {
    diameterExcursionMillimeters: 2 * input.radialExcursionMillimeters,
    excursionRatio:
      (2 * input.radialExcursionMillimeters) / input.meanDiameterMillimeters,
    maximumDiameterMillimeters:
      input.meanDiameterMillimeters + input.radialExcursionMillimeters,
    minimumDiameterMillimeters:
      input.meanDiameterMillimeters - input.radialExcursionMillimeters,
  };
};

export const hairspringBreathingGeometryExample = {
  input: {
    meanDiameterMillimeters: 10,
    radialExcursionMillimeters: 0.2,
  },
  output: {
    diameterExcursionMillimeters: 0.4,
    excursionRatio: 0.04,
    maximumDiameterMillimeters: 10.2,
    minimumDiameterMillimeters: 9.8,
  },
} satisfies ToolExample<
  HairspringBreathingGeometryInput,
  HairspringBreathingGeometryOutput
>;

export const hairspringBreathingGeometryTool = createSimpleTool({
  calculate: (input) =>
    calculateHairspringBreathingGeometry({
      meanDiameterMillimeters: input.meanDiameterMillimeters as number,
      radialExcursionMillimeters: input.radialExcursionMillimeters as number,
    }),
  description:
    "Calculate the diameter envelope of a modeled concentric breathing hairspring excursion without inferring spring geometry from a terminal-curve name.",
  id: "horology/hairspring-concentric-breathing-change-calculator",
  inputs: [
    {
      id: "meanDiameterMillimeters",
      kind: "number",
      label: "Mean breathing diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "radialExcursionMillimeters",
      kind: "number",
      label: "Radial excursion",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "diameterExcursionMillimeters",
      kind: "number",
      label: "Diameter excursion",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "excursionRatio",
      kind: "number",
      label: "Diameter excursion ratio",
      minimum: 0,
    },
    {
      id: "maximumDiameterMillimeters",
      kind: "number",
      label: "Maximum diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "minimumDiameterMillimeters",
      kind: "number",
      label: "Minimum diameter",
      minimum: 0,
      unit: "mm",
    },
  ],
  title: "Hairspring Concentric Breathing Change Calculator",
});

export const runHairspringBreathingGeometry =
  hairspringBreathingGeometryTool.execute;
export default hairspringBreathingGeometryTool;
