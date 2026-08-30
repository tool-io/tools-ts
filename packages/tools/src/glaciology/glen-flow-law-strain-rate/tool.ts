import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly signedShearStressesPa: readonly number[];
  readonly rateFactorPerYearPaToMinusN: number;
  readonly glenExponent: number;
  readonly enhancementFactor: number;
}>;
export type Output = Readonly<{
  readonly signedShearStrainRatesPerYear: readonly number[];
}>;
const inputFields = [
  {
    id: "signedShearStressesPa",
    label: "Signed shear stresses pa",
    kind: "numberList",
  },
  {
    id: "rateFactorPerYearPaToMinusN",
    label: "Rate factor per year pa to minus n",
    kind: "number",
  },
  { id: "glenExponent", label: "Glen exponent", kind: "number" },
  { id: "enhancementFactor", label: "Enhancement factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rateFactorPerYearPaToMinusN, "rateFactorPerYearPaToMinusN");
  positive(input.glenExponent, "glenExponent");
  positive(input.enhancementFactor, "enhancementFactor");
  if (!input.signedShearStressesPa.length)
    simpleError("signedShearStressesPa", "Nonempty shear stresses required.");
  return {
    signedShearStrainRatesPerYear: input.signedShearStressesPa.map(
      (t) =>
        input.rateFactorPerYearPaToMinusN *
        input.enhancementFactor *
        Math.sign(t) *
        Math.abs(t) ** input.glenExponent,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedShearStressesPa: [-2, 0, 2],
  rateFactorPerYearPaToMinusN: 0.1,
  glenExponent: 3,
  enhancementFactor: 2,
} satisfies Input;
export const exampleOutput = {
  signedShearStrainRatesPerYear: [-1.6, 0, 1.6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/glen-flow-law-strain-rate",
  title: "Glen Flow Law Strain Rate",
  description:
    "Evaluate signed scalar Glen shear strain rate A·E·sign(tau)|tau|^n; A units follow n, and shear tensor strain rate differs by a factor two from engineering shear rate.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedShearStrainRatesPerYear",
      label: "Signed shear strain rates per year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      signedShearStressesPa: value.signedShearStressesPa as readonly number[],
      rateFactorPerYearPaToMinusN: value.rateFactorPerYearPaToMinusN as number,
      glenExponent: value.glenExponent as number,
      enhancementFactor: value.enhancementFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
