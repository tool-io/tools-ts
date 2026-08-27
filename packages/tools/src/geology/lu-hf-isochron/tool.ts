import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LuHfIsochronInput = {
  readonly luHf1: number;
  readonly hfRatio1: number;
  readonly luHf2: number;
  readonly hfRatio2: number;
};

export type LuHfIsochronOutput = {
  readonly slope: number;
  readonly initial176Hf177Hf: number;
  readonly ageYears: number;
  readonly ageMa: number;
};

const LAMBDA_LU176_PER_YEAR = 1.865e-11;

/**
 * Two-point Lu-Hf isochron: slope m of 176Hf/177Hf vs 176Lu/177Hf gives
 * t = ln(1 + m) / lambda(Lu-176) with intercept the initial 176Hf/177Hf.
 */
export const calculateLuHfIsochron = (
  input: LuHfIsochronInput,
): LuHfIsochronOutput => {
  if (input.luHf1 === input.luHf2)
    return simpleError(
      "luHf2",
      "The two points must have distinct 176Lu/177Hf values.",
      "degenerate_isochron",
    );
  const slope = (input.hfRatio2 - input.hfRatio1) / (input.luHf2 - input.luHf1);
  if (!(slope >= 0))
    return simpleError(
      "hfRatio2",
      "The isochron slope must be non-negative.",
      "invalid_slope",
    );
  const initial176Hf177Hf = input.hfRatio1 - slope * input.luHf1;
  const ageYears = Math.log(1 + slope) / LAMBDA_LU176_PER_YEAR;
  return {
    slope,
    initial176Hf177Hf,
    ageYears,
    ageMa: ageYears / 1e6,
  };
};

export const luHfIsochronExample = {
  input: { luHf1: 0.01, hfRatio1: 0.2825, luHf2: 0.09, hfRatio2: 0.2827 },
  output: {
    slope: 0.0025000000000004186,
    initial176Hf177Hf: 0.282475,
    ageYears: 133880975.79558118,
    ageMa: 133.88097579558118,
  },
} satisfies ToolExample<LuHfIsochronInput, LuHfIsochronOutput>;

export const luHfIsochronTool = createSimpleTool({
  id: "geology/lu-hf-isochron",
  title: "Geology Lu Hf Isochron Calculator",
  description:
    "Fit a two-point Lu-Hf isochron and convert its slope to an age using the Lu-176 decay constant.",
  inputs: [
    {
      description: "176Lu/177Hf of the first point.",
      id: "luHf1",
      kind: "number",
      label: "176Lu/177Hf #1",
    },
    {
      description: "176Hf/177Hf of the first point.",
      id: "hfRatio1",
      kind: "number",
      label: "176Hf/177Hf #1",
    },
    {
      description: "176Lu/177Hf of the second point.",
      id: "luHf2",
      kind: "number",
      label: "176Lu/177Hf #2",
    },
    {
      description: "176Hf/177Hf of the second point.",
      id: "hfRatio2",
      kind: "number",
      label: "176Hf/177Hf #2",
    },
  ],
  outputs: [
    {
      description: "Isochron slope in 176Hf/177Hf per unit 176Lu/177Hf.",
      id: "slope",
      kind: "number",
      label: "Slope",
    },
    {
      description: "Initial 176Hf/177Hf from the intercept.",
      id: "initial176Hf177Hf",
      kind: "number",
      label: "Initial 176Hf/177Hf",
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
    calculateLuHfIsochron(input as unknown as LuHfIsochronInput),
});

export const runLuHfIsochron = luHfIsochronTool.execute;
export default luHfIsochronTool;
