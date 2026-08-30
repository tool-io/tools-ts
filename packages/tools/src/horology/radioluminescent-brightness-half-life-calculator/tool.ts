import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RadioluminescentDecayInput = {
  readonly elapsedYears: number;
  readonly halfLifeYears: number;
  readonly initialBrightness: number;
};

export type RadioluminescentDecayOutput = {
  readonly comparisonCaution: string;
  readonly elapsedHalfLives: number;
  readonly remainingBrightness: number;
  readonly remainingPercent: number;
};

export const calculateRadioluminescentBrightness = (
  input: RadioluminescentDecayInput,
): RadioluminescentDecayOutput => {
  if (!Number.isFinite(input.initialBrightness) || input.initialBrightness <= 0)
    simpleError(
      "initialBrightness",
      "Initial brightness must be finite and positive.",
      "initial_brightness_invalid",
    );
  if (!Number.isFinite(input.halfLifeYears) || input.halfLifeYears <= 0)
    simpleError(
      "halfLifeYears",
      "Half-life must be finite and positive.",
      "half_life_invalid",
    );
  if (!Number.isFinite(input.elapsedYears) || input.elapsedYears < 0)
    simpleError(
      "elapsedYears",
      "Elapsed years must be finite and nonnegative.",
      "elapsed_years_invalid",
    );
  const elapsedHalfLives = input.elapsedYears / input.halfLifeYears;
  const remainingFactor = 2 ** -elapsedHalfLives;
  return {
    comparisonCaution:
      "This exponential half-life model does not compare different phosphor or radioluminescent formulations; real initial output, color, aging, contamination, and dose rate require product-specific measurements.",
    elapsedHalfLives,
    remainingBrightness: input.initialBrightness * remainingFactor,
    remainingPercent: 100 * remainingFactor,
  };
};

export const radioluminescentDecayExample = {
  input: { elapsedYears: 12.32, halfLifeYears: 12.32, initialBrightness: 100 },
  output: {
    comparisonCaution:
      "This exponential half-life model does not compare different phosphor or radioluminescent formulations; real initial output, color, aging, contamination, and dose rate require product-specific measurements.",
    elapsedHalfLives: 1,
    remainingBrightness: 50,
    remainingPercent: 50,
  },
} satisfies ToolExample<
  RadioluminescentDecayInput,
  RadioluminescentDecayOutput
>;

export const radioluminescentDecayTool = createSimpleTool({
  calculate: (input) =>
    calculateRadioluminescentBrightness({
      elapsedYears: input.elapsedYears as number,
      halfLifeYears: input.halfLifeYears as number,
      initialBrightness: input.initialBrightness as number,
    }),
  description:
    "Apply an explicit radioactive half-life model to caller-supplied initial brightness without comparing different lume chemistries or claiming measured nighttime luminance.",
  id: "horology/radioluminescent-brightness-half-life-calculator",
  inputs: [
    {
      id: "elapsedYears",
      kind: "number",
      label: "Elapsed time",
      minimum: 0,
      unit: "year",
    },
    {
      id: "halfLifeYears",
      kind: "number",
      label: "Effective half-life",
      minimum: 0,
      unit: "year",
    },
    {
      id: "initialBrightness",
      kind: "number",
      label: "Initial relative brightness",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "comparisonCaution",
      kind: "string",
      label: "Lume comparison caution",
    },
    {
      id: "elapsedHalfLives",
      kind: "number",
      label: "Elapsed half-lives",
      minimum: 0,
    },
    {
      id: "remainingBrightness",
      kind: "number",
      label: "Modeled remaining relative brightness",
      minimum: 0,
    },
    {
      id: "remainingPercent",
      kind: "number",
      label: "Modeled remaining percent",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Radioluminescent Brightness Half Life Calculator",
});

export const runRadioluminescentDecay = radioluminescentDecayTool.execute;
export default radioluminescentDecayTool;
