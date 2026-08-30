import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly distancesFromDivideM: readonly number[];
  readonly halfLengthM: number;
  readonly uniformAccumulationMetersIcePerYear: number;
  readonly glenExponent: number;
  readonly rateFactorPerYearPaToMinusN: number;
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly steadyThicknessesM: readonly number[];
}>;
const inputFields = [
  {
    id: "distancesFromDivideM",
    label: "Distances from divide m",
    kind: "numberList",
  },
  { id: "halfLengthM", label: "Half length m", kind: "number" },
  {
    id: "uniformAccumulationMetersIcePerYear",
    label: "Uniform accumulation meters ice per year",
    kind: "number",
  },
  { id: "glenExponent", label: "Glen exponent", kind: "number" },
  {
    id: "rateFactorPerYearPaToMinusN",
    label: "Rate factor per year pa to minus n",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.halfLengthM, "halfLengthM");
  positive(
    input.uniformAccumulationMetersIcePerYear,
    "uniformAccumulationMetersIcePerYear",
  );
  positive(input.glenExponent, "glenExponent");
  positive(input.rateFactorPerYearPaToMinusN, "rateFactorPerYearPaToMinusN");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.distancesFromDivideM.forEach((v) =>
    nonnegative(v, "distancesFromDivideM"),
  );
  if (
    !input.distancesFromDivideM.length ||
    input.glenExponent > 5 ||
    input.distancesFromDivideM.some((v) => v > input.halfLengthM)
  )
    simpleError(
      "distancesFromDivideM",
      "Nonempty positions within a half dome and exponent in (0,5] required.",
    );
  const n = input.glenExponent,
    c =
      ((2 * input.rateFactorPerYearPaToMinusN) / (n + 2)) *
      (input.iceDensityKgPerM3 * input.gravityMPerSecondSquared) ** n,
    p = (n + 1) / n,
    k =
      2 *
      (input.uniformAccumulationMetersIcePerYear / positive(c, "model")) **
        (1 / n);
  return {
    steadyThicknessesM: input.distancesFromDivideM.map(
      (x) => (k * (input.halfLengthM ** p - x ** p)) ** (n / (2 * n + 2)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  distancesFromDivideM: [0, 1, 2],
  halfLengthM: 2,
  uniformAccumulationMetersIcePerYear: 1,
  glenExponent: 1,
  rateFactorPerYearPaToMinusN: 1,
  iceDensityKgPerM3: 1,
  gravityMPerSecondSquared: 1,
} satisfies Input;
export const exampleOutput = {
  steadyThicknessesM: [1.8612097182041991, 1.7320508075688772, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/steady-state-thickness-profile-vialov",
  title: "Steady State Thickness Profile Vialov",
  description:
    "Evaluate ideal Vialov flat-bed, no-sliding, isothermal Glen-flow half-dome with uniform ice-equivalent accumulation and zero terminus thickness; no bed geometry or transient dynamics.",
  inputs: inputFields,
  outputs: [
    {
      id: "steadyThicknessesM",
      label: "Steady thicknesses m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      distancesFromDivideM: value.distancesFromDivideM as readonly number[],
      halfLengthM: value.halfLengthM as number,
      uniformAccumulationMetersIcePerYear:
        value.uniformAccumulationMetersIcePerYear as number,
      glenExponent: value.glenExponent as number,
      rateFactorPerYearPaToMinusN: value.rateFactorPerYearPaToMinusN as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
