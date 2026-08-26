import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RogersCastroAgeProfileLookupInput = {
  readonly ages: readonly number[];
  readonly a1: number;
  readonly alpha1: number;
  readonly a2: number;
  readonly a3: number;
  readonly alpha2: number;
  readonly mu2: number;
};

export type RogersCastroAgeProfileLookupOutput = {
  readonly fittedRates: number[];
};

export const calculateRogersCastroAgeProfileLookup = (
  input: RogersCastroAgeProfileLookupInput,
): RogersCastroAgeProfileLookupOutput => {
  if (input.ages.length === 0)
    simpleError("ages", "Provide at least one age.", "invalid_list");
  for (const value of input.ages)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "ages",
        "Ages must be finite and non-negative.",
        "invalid_list",
      );
  for (const key of ["a1", "a2", "a3"] as const)
    if (!(input[key] >= 0))
      simpleError(
        key,
        "Curve amplitudes must be non-negative.",
        "invalid_parameter",
      );
  for (const key of ["alpha1", "alpha2"] as const)
    if (!(input[key] >= 0))
      simpleError(
        key,
        "Decay slopes must be non-negative.",
        "invalid_parameter",
      );
  return {
    fittedRates: input.ages.map(
      (age) =>
        input.a1 * Math.exp(-input.alpha1 * age) +
        input.a2 +
        input.a3 * Math.exp(-input.alpha2 * Math.abs(age - input.mu2)),
    ),
  };
};

export const rogersCastroAgeProfileLookupExample = {
  input: {
    ages: [0, 10, 25, 60],
    a1: 0.02,
    alpha1: 0.1,
    a2: 0.002,
    a3: 0.01,
    alpha2: 0.3,
    mu2: 25,
  },
  output: {
    fittedRates: [
      0.022005530843701476, 0.00946867878881127, 0.013641699972477977,
      0.0020498504080268248,
    ],
  },
} satisfies ToolExample<
  RogersCastroAgeProfileLookupInput,
  RogersCastroAgeProfileLookupOutput
>;

export const rogersCastroAgeProfileLookupTool = createSimpleTool({
  id: "demography/rogers-castro-age-profile-lookup",
  title: "Rogers Castro Age Profile Lookup",
  description:
    "Evaluate the seven-parameter Rogers-Castro migration schedule m(x) = a1 exp(-alpha1 x) + a2 + a3 exp(-alpha2 |x - mu2|), covering the childhood decay, baseline level and labor-force peak, at any requested ages.",
  inputs: [
    {
      description: "Ages in years at which to evaluate the schedule.",
      id: "ages",
      kind: "numberList",
      label: "Ages",
    },
    {
      description: "Childhood-term amplitude a1.",
      id: "a1",
      kind: "number",
      label: "a1",
      minimum: 0,
    },
    {
      description: "Childhood-term decay slope alpha1.",
      id: "alpha1",
      kind: "number",
      label: "alpha1",
      minimum: 0,
    },
    {
      description: "Constant baseline intensity a2.",
      id: "a2",
      kind: "number",
      label: "a2",
      minimum: 0,
    },
    {
      description: "Labor-force peak amplitude a3.",
      id: "a3",
      kind: "number",
      label: "a3",
      minimum: 0,
    },
    {
      description: "Labor-force slope alpha2.",
      id: "alpha2",
      kind: "number",
      label: "alpha2",
      minimum: 0,
    },
    {
      description: "Labor-force peak location mu2 in years.",
      id: "mu2",
      kind: "number",
      label: "mu2",
    },
  ],
  outputs: [
    {
      description: "Fitted migration rate at each requested age.",
      id: "fittedRates",
      kind: "numberList",
      label: "m(x)",
    },
  ],
  calculate: (input) =>
    calculateRogersCastroAgeProfileLookup(
      input as unknown as RogersCastroAgeProfileLookupInput,
    ),
});

export const runRogersCastroAgeProfileLookup =
  rogersCastroAgeProfileLookupTool.execute;
export default rogersCastroAgeProfileLookupTool;
