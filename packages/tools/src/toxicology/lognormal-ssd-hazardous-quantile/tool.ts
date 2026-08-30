import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, normalQuantile } from "../shared.js";
export type Input = Readonly<{
  readonly logConcentrationMean: number;
  readonly logConcentrationSd: number;
  readonly affectedSpeciesFraction: number;
}>;
export type Output = Readonly<{
  readonly hazardousConcentration: number;
}>;
const inputFields = [
  {
    id: "logConcentrationMean",
    label: "Log concentration mean",
    kind: "number",
  },
  { id: "logConcentrationSd", label: "Log concentration sd", kind: "number" },
  {
    id: "affectedSpeciesFraction",
    label: "Affected species fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.logConcentrationSd, "logConcentrationSd");
  const z = normalQuantile(input.affectedSpeciesFraction);
  return {
    hazardousConcentration: Math.exp(
      input.logConcentrationMean + input.logConcentrationSd * z,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  logConcentrationMean: 0,
  logConcentrationSd: 1,
  affectedSpeciesFraction: 0.05,
} satisfies Input;
export const exampleOutput = {
  hazardousConcentration: 0.19304081669873657,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/lognormal-ssd-hazardous-quantile",
  title: "SSD HC5",
  description:
    "Calculate a lognormal species-sensitivity hazardous concentration at a supplied species fraction (e.g. HC5); natural-log fit parameters are supplied and this is not a PNEC or confidence bound.",
  inputs: inputFields,
  outputs: [
    {
      id: "hazardousConcentration",
      label: "Hazardous concentration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      logConcentrationMean: value.logConcentrationMean as number,
      logConcentrationSd: value.logConcentrationSd as number,
      affectedSpeciesFraction: value.affectedSpeciesFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
