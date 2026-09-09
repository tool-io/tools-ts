import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPorosityFraction: number;
  readonly callerFormationTortuosityCoefficient: number;
  readonly callerFormationCementationExponent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPorosityFraction",
    label: "Actual porosity fraction",
    kind: "number",
  },
  {
    id: "callerFormationTortuosityCoefficient",
    label: "Caller formation tortuosity coefficient",
    kind: "number",
  },
  {
    id: "callerFormationCementationExponent",
    label: "Caller formation cementation exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualPorosityFraction, "porosity");
  positive(input.actualPorosityFraction, "porosity");
  positive(input.callerFormationTortuosityCoefficient, "a");
  positive(input.callerFormationCementationExponent, "m");
  return {
    conditionalArchieFormationFactor:
      input.callerFormationTortuosityCoefficient /
      input.actualPorosityFraction ** input.callerFormationCementationExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPorosityFraction: 0.5,
    callerFormationTortuosityCoefficient: 1,
    callerFormationCementationExponent: 2,
  },
  output: { result: { conditionalArchieFormationFactor: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/petrophysical-formation-factor-archie",
  title: "Geology Petrophysical Formation Factor Archie Calculator",
  description:
    "Independently calibrated Archieformation factorF=a\u03c6^\u2212m, dimensionless interconnected porosity. Not saturation, shaley conductivity model or universal m=2coefficient.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
