import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  linearFit,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly corePorosities: readonly number[];
  readonly fullySaturatedFormationFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedCementationExponent: number;
  readonly fittedTortuosityCoefficient: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "corePorosities", label: "Core porosities", kind: "numberList" },
  {
    id: "fullySaturatedFormationFactors",
    label: "Fully saturated formation factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.corePorosities.forEach((v) => positive(v, "corePorosities"));
  input.fullySaturatedFormationFactors.forEach((v) =>
    positive(v, "fullySaturatedFormationFactors"),
  );
  input.corePorosities.forEach((v) => fraction(v, "porosity"));
  const f = linearFit(
    input.corePorosities.map(Math.log),
    input.fullySaturatedFormationFactors.map(Math.log),
  );
  return {
    fittedCementationExponent: -f.slope,
    fittedTortuosityCoefficient: Math.exp(f.intercept),
    fitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  corePorosities: [0.25, 0.5],
  fullySaturatedFormationFactors: [16, 4],
} satisfies Input;
export const exampleOutput = {
  fittedCementationExponent: 2,
  fittedTortuosityCoefficient: 1,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/petrophysical-cementation-exponent-m",
  title: "Geology Petrophysical Cementation Exponent M Calculator",
  description:
    "FIT fully brine-saturated core ArchieF=aφ^(−m) data, not supplied exponent forward resistance or partial-saturation estimate. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedCementationExponent",
      label: "Fitted cementation exponent",
      kind: "number",
    },
    {
      id: "fittedTortuosityCoefficient",
      label: "Fitted tortuosity coefficient",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      corePorosities: value.corePorosities as readonly number[],
      fullySaturatedFormationFactors:
        value.fullySaturatedFormationFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
