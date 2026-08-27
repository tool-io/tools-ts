import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RbSrIsochronInput = {
  readonly rbSr1: number;
  readonly srRatio1: number;
  readonly rbSr2: number;
  readonly srRatio2: number;
};

export type RbSrIsochronOutput = {
  readonly slope: number;
  readonly initial87Sr86Sr: number;
  readonly ageYears: number;
  readonly ageMa: number;
};

const LAMBDA_RB87_PER_YEAR = 1.42e-11;

/**
 * Two-point Rb-Sr isochron: slope m of 87Sr/86Sr vs 87Rb/86Sr gives
 * t = ln(1 + m) / lambda(Rb-87) with intercept the initial 87Sr/86Sr.
 */
export const calculateRbSrIsochron = (
  input: RbSrIsochronInput,
): RbSrIsochronOutput => {
  if (input.rbSr1 === input.rbSr2)
    return simpleError(
      "rbSr2",
      "The two points must have distinct 87Rb/86Sr values.",
      "degenerate_isochron",
    );
  const slope = (input.srRatio2 - input.srRatio1) / (input.rbSr2 - input.rbSr1);
  if (!(slope >= 0))
    return simpleError(
      "srRatio2",
      "The isochron slope must be non-negative.",
      "invalid_slope",
    );
  const initial87Sr86Sr = input.srRatio1 - slope * input.rbSr1;
  const ageYears = Math.log(1 + slope) / LAMBDA_RB87_PER_YEAR;
  return {
    slope,
    initial87Sr86Sr,
    ageYears,
    ageMa: ageYears / 1e6,
  };
};

export const rbSrIsochronExample = {
  input: { rbSr1: 10, srRatio1: 0.72, rbSr2: 30, srRatio2: 0.82 },
  output: {
    slope: 0.004999999999999999,
    initial87Sr86Sr: 0.6699999999999999,
    ageYears: 351235317.6788006,
    ageMa: 351.2353176788006,
  },
} satisfies ToolExample<RbSrIsochronInput, RbSrIsochronOutput>;

export const rbSrIsochronTool = createSimpleTool({
  id: "geology/rb-sr-isochron",
  title: "Geology Rb Sr Isochron Calculator",
  description:
    "Fit a two-point Rb-Sr isochron and convert its slope to an age using the Rb-87 decay constant.",
  inputs: [
    {
      description: "87Rb/86Sr of the first point.",
      id: "rbSr1",
      kind: "number",
      label: "87Rb/86Sr #1",
    },
    {
      description: "87Sr/86Sr of the first point.",
      id: "srRatio1",
      kind: "number",
      label: "87Sr/86Sr #1",
    },
    {
      description: "87Rb/86Sr of the second point.",
      id: "rbSr2",
      kind: "number",
      label: "87Rb/86Sr #2",
    },
    {
      description: "87Sr/86Sr of the second point.",
      id: "srRatio2",
      kind: "number",
      label: "87Sr/86Sr #2",
    },
  ],
  outputs: [
    {
      description: "Isochron slope in 87Sr/86Sr per unit 87Rb/86Sr.",
      id: "slope",
      kind: "number",
      label: "Slope",
    },
    {
      description: "Initial 87Sr/86Sr from the intercept.",
      id: "initial87Sr86Sr",
      kind: "number",
      label: "Initial 87Sr/86Sr",
    },
    {
      description: "Isochron age in years.",
      id: "ageYears",
      kind: "number",
      label: "Age (yr)",
    },
    {
      description: "Isochron age in millions of years.",
      id: "ageMa",
      kind: "number",
      label: "Age (Ma)",
    },
  ],
  calculate: (input) =>
    calculateRbSrIsochron(input as unknown as RbSrIsochronInput),
});

export const runRbSrIsochron = rbSrIsochronTool.execute;
export default rbSrIsochronTool;
