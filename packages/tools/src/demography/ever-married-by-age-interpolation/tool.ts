import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EverMarriedByAgeInterpolationInput = {
  readonly proportionEverMarried: readonly number[];
  readonly targetAge: number;
  readonly startAge?: number;
  readonly intervalWidth?: number;
};

export type EverMarriedByAgeInterpolationOutput = {
  readonly everMarriedProportion: number;
};

export const calculateEverMarriedByAgeInterpolation = (
  input: EverMarriedByAgeInterpolationInput,
): EverMarriedByAgeInterpolationOutput => {
  const values = input.proportionEverMarried;
  const startAge = input.startAge ?? 15;
  const width = input.intervalWidth ?? 5;
  if (values.length < 2)
    return simpleError(
      "proportionEverMarried",
      "Provide proportions for at least two age groups.",
      "invalid_list",
    );
  for (const value of values)
    if (!(value >= 0 && value <= 1))
      return simpleError(
        "proportionEverMarried",
        "Proportions ever married must lie between zero and one.",
        "invalid_list",
      );
  if (!(startAge >= 0))
    return simpleError(
      "startAge",
      "The starting age must be non-negative.",
      "invalid_start",
    );
  if (!(width > 0))
    return simpleError(
      "intervalWidth",
      "The interval width must be greater than zero.",
      "invalid_width",
    );
  if (!(input.targetAge >= 0))
    return simpleError(
      "targetAge",
      "The target age must be non-negative.",
      "invalid_target",
    );
  const midpoints = values.map((_, index) => startAge + width * (index + 0.5));
  const first = values[0] as number;
  const last = values[values.length - 1] as number;
  if (input.targetAge <= (midpoints[0] as number))
    return { everMarriedProportion: first };
  if (input.targetAge >= (midpoints[midpoints.length - 1] as number))
    return { everMarriedProportion: last };
  let bracket = 0;
  while ((midpoints[bracket + 1] as number) < input.targetAge) bracket += 1;
  const lower = midpoints[bracket] as number;
  return {
    everMarriedProportion:
      (values[bracket] as number) +
      (((values[bracket + 1] as number) - (values[bracket] as number)) *
        (input.targetAge - lower)) /
        width,
  };
};

export const everMarriedByAgeInterpolationExample = {
  input: {
    proportionEverMarried: [0.11, 0.42, 0.73, 0.88],
    targetAge: 24,
    startAge: 15,
    intervalWidth: 5,
  },
  output: { everMarriedProportion: 0.513 },
} satisfies ToolExample<
  EverMarriedByAgeInterpolationInput,
  EverMarriedByAgeInterpolationOutput
>;

export const everMarriedByAgeInterpolationTool = createSimpleTool({
  id: "demography/ever-married-by-age-interpolation",
  title: "Ever-Married by Age Interpolation Calculator",
  description:
    "Linearly interpolate the proportion ever married at a target age from group values placed at five-year-group midpoints, holding the endpoint groups constant outside their midpoints.",
  inputs: [
    {
      description: "Proportion ever married in each successive age group.",
      id: "proportionEverMarried",
      kind: "numberList",
      label: "Ever married",
    },
    {
      description:
        "Exact age at which to interpolate the proportion ever married.",
      id: "targetAge",
      kind: "number",
      label: "Target age",
      minimum: 0,
    },
    {
      default: 15,
      description: "Age at the start of the first group.",
      id: "startAge",
      kind: "number",
      label: "Start age",
      minimum: 0,
    },
    {
      default: 5,
      description: "Width of each age group in years.",
      id: "intervalWidth",
      kind: "number",
      label: "Group width",
    },
  ],
  outputs: [
    {
      description: "Interpolated proportion ever married at the target age.",
      id: "everMarriedProportion",
      kind: "number",
      label: "Ever married",
    },
  ],
  calculate: (input) =>
    calculateEverMarriedByAgeInterpolation(
      input as unknown as EverMarriedByAgeInterpolationInput,
    ),
});

export const runEverMarriedByAgeInterpolation =
  everMarriedByAgeInterpolationTool.execute;
export default everMarriedByAgeInterpolationTool;
