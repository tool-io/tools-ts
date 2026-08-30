import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeclinationDriftAdjusterInput = Readonly<{
  readonly initialDeclinationDegrees: number;
  readonly annualChangeDegreesPerYear: number;
  readonly elapsedYears: number;
}>;
export type DeclinationDriftAdjusterOutput = Readonly<{
  readonly projectedDeclinationDegrees: number;
}>;

export const calculateDeclinationDriftAdjuster = (
  x: DeclinationDriftAdjusterInput,
): DeclinationDriftAdjusterOutput => {
  if (!Number.isFinite(x.initialDeclinationDegrees))
    simpleError("initialDeclinationDegrees", "Provide a finite number.");
  if (!Number.isFinite(x.annualChangeDegreesPerYear))
    simpleError("annualChangeDegreesPerYear", "Provide a finite number.");
  if (!Number.isFinite(x.elapsedYears) || x.elapsedYears < 0)
    simpleError("elapsedYears", "Provide a finite nonnegative number.");
  const projectedDeclinationDegrees =
    x.initialDeclinationDegrees + x.annualChangeDegreesPerYear * x.elapsedYears;
  if (!Number.isFinite(projectedDeclinationDegrees))
    simpleError(
      "projectedDeclinationDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    projectedDeclinationDegrees: Object.is(projectedDeclinationDegrees, -0)
      ? 0
      : projectedDeclinationDegrees,
  };
};

export const example = {
  input: {
    initialDeclinationDegrees: 5,
    annualChangeDegreesPerYear: -0.1,
    elapsedYears: 10,
  },
  output: { projectedDeclinationDegrees: 4 },
} satisfies ToolExample<
  DeclinationDriftAdjusterInput,
  DeclinationDriftAdjusterOutput
>;

export const tool = createSimpleTool({
  id: "cartography/declination-drift-adjuster",
  title: "Declination Drift Adjuster",
  description:
    "Project signed east-positive magnetic declination using a signed annual change in degrees per year.",
  inputs: [
    {
      id: "initialDeclinationDegrees",
      kind: "number",
      label: "Initial Declination Degrees",
      unit: "deg",
    },
    {
      id: "annualChangeDegreesPerYear",
      kind: "number",
      label: "Annual Change Degrees Per Year",
      unit: "deg/year",
    },
    {
      id: "elapsedYears",
      kind: "number",
      label: "Elapsed Years",
      unit: "year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "projectedDeclinationDegrees",
      kind: "number",
      label: "Projected Declination Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateDeclinationDriftAdjuster({
      initialDeclinationDegrees: input.initialDeclinationDegrees as number,
      annualChangeDegreesPerYear: input.annualChangeDegreesPerYear as number,
      elapsedYears: input.elapsedYears as number,
    }),
});
export const declinationDriftAdjusterTool = tool;
export const runDeclinationDriftAdjuster = tool.execute;
export default tool;
