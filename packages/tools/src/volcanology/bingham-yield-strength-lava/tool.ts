import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredShearRatesPerSecond: readonly number[];
  readonly measuredShearStressesPa: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredYieldStressPa: number;
  readonly inferredPlasticViscosityPaSeconds: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "measuredShearRatesPerSecond",
    label: "Measured shear rates per second",
    kind: "numberList",
  },
  {
    id: "measuredShearStressesPa",
    label: "Measured shear stresses pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredShearRatesPerSecond.forEach((v) =>
    positive(v, "measuredShearRatesPerSecond"),
  );
  input.measuredShearStressesPa.forEach((v) =>
    nonnegative(v, "measuredShearStressesPa"),
  );
  const fit = regression(
    input.measuredShearRatesPerSecond,
    input.measuredShearStressesPa,
  );
  return {
    inferredYieldStressPa: nonnegative(fit.intercept, "yieldIntercept"),
    inferredPlasticViscosityPaSeconds: positive(fit.slope, "viscositySlope"),
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredShearRatesPerSecond: [1, 2, 3],
  measuredShearStressesPa: [12, 14, 16],
} satisfies Input;
export const exampleOutput = {
  inferredYieldStressPa: 10,
  inferredPlasticViscosityPaSeconds: 2,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/bingham-yield-strength-lava",
  title: "Bingham Yield Strength Lava",
  description:
    "Infer Bingham yield intercept and plastic viscosity from measured yielded shear pairs; negative intercept or nonpositive slope is rejected instead of asserting a physical yield law.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredYieldStressPa",
      label: "Inferred yield stress pa",
      kind: "number",
    },
    {
      id: "inferredPlasticViscosityPaSeconds",
      label: "Inferred plastic viscosity pa seconds",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      measuredShearRatesPerSecond:
        value.measuredShearRatesPerSecond as readonly number[],
      measuredShearStressesPa:
        value.measuredShearStressesPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
