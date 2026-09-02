import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, rad } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyComputedNutationLongitudeArcsec: number;
  readonly independentlyComputedTrueObliquityDegrees: number;
  readonly callerAdditionalEquinoxTermsArcsec: readonly number[];
}>;
export type Output = Readonly<{ readonly equationOfEquinoxesArcsec: number }>;
const inputFields = [
  {
    id: "independentlyComputedNutationLongitudeArcsec",
    label: "Independently computed nutation longitude arcsec",
    kind: "number",
  },
  {
    id: "independentlyComputedTrueObliquityDegrees",
    label: "Independently computed true obliquity degrees",
    kind: "number",
  },
  {
    id: "callerAdditionalEquinoxTermsArcsec",
    label: "Caller additional equinox terms arcsec",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.independentlyComputedTrueObliquityDegrees < 0 ||
    input.independentlyComputedTrueObliquityDegrees > 90
  )
    simpleError("obliquity", "0..90°.");
  return {
    equationOfEquinoxesArcsec:
      input.independentlyComputedNutationLongitudeArcsec *
        Math.cos(rad(input.independentlyComputedTrueObliquityDegrees)) +
      sum(input.callerAdditionalEquinoxTermsArcsec),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyComputedNutationLongitudeArcsec: 10,
  independentlyComputedTrueObliquityDegrees: 60,
  callerAdditionalEquinoxTermsArcsec: [1, -0.5],
} satisfies Input;
export const exampleOutput = {
  equationOfEquinoxesArcsec: 5.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/equation-equinoxes-summator",
  title: "Equation of the Equinoxes Component Summator",
  description:
    "Equation-of-equinoxes leadingΔψcosεplus caller independently edition-matched additional terms; not generate IAU series or double-count already full term. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "equationOfEquinoxesArcsec",
      label: "Equation of equinoxes arcsec",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyComputedNutationLongitudeArcsec:
        value.independentlyComputedNutationLongitudeArcsec as number,
      independentlyComputedTrueObliquityDegrees:
        value.independentlyComputedTrueObliquityDegrees as number,
      callerAdditionalEquinoxTermsArcsec:
        value.callerAdditionalEquinoxTermsArcsec as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
