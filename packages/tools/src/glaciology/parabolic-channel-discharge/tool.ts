import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly halfWidthM: number;
  readonly centerThicknessM: number;
  readonly glenExponent: number;
  readonly rateFactorPerYearPaToMinusN: number;
  readonly drivingStressGradientPaPerMeter: number;
  readonly uniformSlidingVelocityMPerYear: number;
}>;
export type Output = Readonly<{
  readonly crossSectionAreaM2: number;
  readonly deformationFluxM3PerYear: number;
  readonly slidingFluxM3PerYear: number;
  readonly totalFluxM3PerYear: number;
}>;
const inputFields = [
  { id: "halfWidthM", label: "Half width m", kind: "number" },
  { id: "centerThicknessM", label: "Center thickness m", kind: "number" },
  { id: "glenExponent", label: "Glen exponent", kind: "integer" },
  {
    id: "rateFactorPerYearPaToMinusN",
    label: "Rate factor per year pa to minus n",
    kind: "number",
  },
  {
    id: "drivingStressGradientPaPerMeter",
    label: "Driving stress gradient pa per meter",
    kind: "number",
  },
  {
    id: "uniformSlidingVelocityMPerYear",
    label: "Uniform sliding velocity m per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.halfWidthM, "halfWidthM");
  positive(input.centerThicknessM, "centerThicknessM");
  positive(input.glenExponent, "glenExponent");
  positive(input.rateFactorPerYearPaToMinusN, "rateFactorPerYearPaToMinusN");
  nonnegative(
    input.drivingStressGradientPaPerMeter,
    "drivingStressGradientPaPerMeter",
  );
  nonnegative(
    input.uniformSlidingVelocityMPerYear,
    "uniformSlidingVelocityMPerYear",
  );
  count(input.glenExponent, "glenExponent");
  if (input.glenExponent > 5)
    simpleError(
      "glenExponent",
      "Integer exponents 1–5 supported for exact parabolic integration.",
    );
  const n = input.glenExponent,
    m = n + 2;
  // Integral from 0 to 1 of (1-y²)^m, without alternating-sum cancellation.
  let sum = 1;
  for (let k = 1; k <= m; k++) sum *= (2 * k) / (2 * k + 1);
  const crossSectionAreaM2 =
      (4 * input.halfWidthM * input.centerThicknessM) / 3,
    deformationFluxM3PerYear =
      ((2 * input.rateFactorPerYearPaToMinusN) / (n + 2)) *
      input.drivingStressGradientPaPerMeter ** n *
      input.centerThicknessM ** (n + 2) *
      2 *
      input.halfWidthM *
      sum,
    slidingFluxM3PerYear =
      crossSectionAreaM2 * input.uniformSlidingVelocityMPerYear;
  return {
    crossSectionAreaM2,
    deformationFluxM3PerYear,
    slidingFluxM3PerYear,
    totalFluxM3PerYear: deformationFluxM3PerYear + slidingFluxM3PerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  halfWidthM: 1,
  centerThicknessM: 1,
  glenExponent: 1,
  rateFactorPerYearPaToMinusN: 1,
  drivingStressGradientPaPerMeter: 1,
  uniformSlidingVelocityMPerYear: 0,
} satisfies Input;
export const exampleOutput = {
  crossSectionAreaM2: 1.3333333333333333,
  deformationFluxM3PerYear: 0.6095238095238096,
  slidingFluxM3PerYear: 0,
  totalFluxM3PerYear: 0.6095238095238096,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/parabolic-channel-discharge",
  title: "Parabolic Channel Discharge",
  description:
    "Analytically integrate local slab Glen flux over a parabolic thickness section plus uniform sliding; excludes lateral stress coupling and uses stress-gradient units Pa/m.",
  inputs: inputFields,
  outputs: [
    {
      id: "crossSectionAreaM2",
      label: "Cross section area m2",
      kind: "number",
    },
    {
      id: "deformationFluxM3PerYear",
      label: "Deformation flux m3 per year",
      kind: "number",
    },
    {
      id: "slidingFluxM3PerYear",
      label: "Sliding flux m3 per year",
      kind: "number",
    },
    {
      id: "totalFluxM3PerYear",
      label: "Total flux m3 per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      halfWidthM: value.halfWidthM as number,
      centerThicknessM: value.centerThicknessM as number,
      glenExponent: value.glenExponent as number,
      rateFactorPerYearPaToMinusN: value.rateFactorPerYearPaToMinusN as number,
      drivingStressGradientPaPerMeter:
        value.drivingStressGradientPaPerMeter as number,
      uniformSlidingVelocityMPerYear:
        value.uniformSlidingVelocityMPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
