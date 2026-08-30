import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly signedBasalShearStressesPa: readonly number[];
  readonly effectivePressuresPa: readonly number[];
  readonly slidingCoefficient: number;
  readonly stressExponent: number;
  readonly pressureExponent: number;
}>;
export type Output = Readonly<{
  readonly signedSlidingVelocitiesMPerYear: readonly number[];
}>;
const inputFields = [
  {
    id: "signedBasalShearStressesPa",
    label: "Signed basal shear stresses pa",
    kind: "numberList",
  },
  {
    id: "effectivePressuresPa",
    label: "Effective pressures pa",
    kind: "numberList",
  },
  { id: "slidingCoefficient", label: "Sliding coefficient", kind: "number" },
  { id: "stressExponent", label: "Stress exponent", kind: "number" },
  { id: "pressureExponent", label: "Pressure exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.effectivePressuresPa.forEach((v) =>
    positive(v, "effectivePressuresPa"),
  );
  positive(input.slidingCoefficient, "slidingCoefficient");
  positive(input.stressExponent, "stressExponent");
  nonnegative(input.pressureExponent, "pressureExponent");
  aligned(
    input.signedBasalShearStressesPa,
    input.effectivePressuresPa,
    "signedBasalShearStressesPa",
  );
  return {
    signedSlidingVelocitiesMPerYear: input.signedBasalShearStressesPa.map(
      (t, i) =>
        (input.slidingCoefficient *
          Math.sign(t) *
          Math.abs(t) ** input.stressExponent) /
        input.effectivePressuresPa[i] ** input.pressureExponent,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedBasalShearStressesPa: [-2, 0, 2],
  effectivePressuresPa: [4, 4, 4],
  slidingCoefficient: 3,
  stressExponent: 2,
  pressureExponent: 1,
} satisfies Input;
export const exampleOutput = {
  signedSlidingVelocitiesMPerYear: [-3, 0, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/weertman-basal-sliding-law",
  title: "Weertman Basal Sliding Law",
  description:
    "Evaluate a supplied Weertman-type power sliding law C·sign(tau)|tau|^p/N^q; coefficient is unit-specific and zero/negative effective pressures lie outside the model.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSlidingVelocitiesMPerYear",
      label: "Signed sliding velocities m per year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      signedBasalShearStressesPa:
        value.signedBasalShearStressesPa as readonly number[],
      effectivePressuresPa: value.effectivePressuresPa as readonly number[],
      slidingCoefficient: value.slidingCoefficient as number,
      stressExponent: value.stressExponent as number,
      pressureExponent: value.pressureExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
