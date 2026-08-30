import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly logKow: number;
  readonly molecularWeight: number;
  readonly intercept: number;
  readonly logKowCoefficient: number;
  readonly molecularWeightCoefficient: number;
}>;
export type Output = Readonly<{
  readonly log10PermeabilityCmPerHour: number;
  readonly permeabilityCmPerHour: number;
}>;
const inputFields = [
  { id: "logKow", label: "Log kow", kind: "number" },
  { id: "molecularWeight", label: "Molecular weight", kind: "number" },
  { id: "intercept", label: "Intercept", kind: "number" },
  { id: "logKowCoefficient", label: "Log kow coefficient", kind: "number" },
  {
    id: "molecularWeightCoefficient",
    label: "Molecular weight coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.molecularWeight, "molecularWeight");
  const log10PermeabilityCmPerHour =
    input.intercept +
    input.logKowCoefficient * input.logKow +
    input.molecularWeightCoefficient * input.molecularWeight;
  return {
    log10PermeabilityCmPerHour,
    permeabilityCmPerHour: 10 ** log10PermeabilityCmPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  logKow: 2,
  molecularWeight: 100,
  intercept: -2.72,
  logKowCoefficient: 0.71,
  molecularWeightCoefficient: -0.0061,
} satisfies Input;
export const exampleOutput = {
  log10PermeabilityCmPerHour: -1.91,
  permeabilityCmPerHour: 0.012302687708123818,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/calibrated-skin-permeability-qsar",
  title: "Skin Permeability Coefficient",
  description:
    "Evaluate a caller-calibrated linear log10 skin permeability model from logKow and molecular weight; model coefficients, applicability and chemical ionization are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "log10PermeabilityCmPerHour",
      label: "Log10 permeability cm per hour",
      kind: "number",
    },
    {
      id: "permeabilityCmPerHour",
      label: "Permeability cm per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      logKow: value.logKow as number,
      molecularWeight: value.molecularWeight as number,
      intercept: value.intercept as number,
      logKowCoefficient: value.logKowCoefficient as number,
      molecularWeightCoefficient: value.molecularWeightCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
