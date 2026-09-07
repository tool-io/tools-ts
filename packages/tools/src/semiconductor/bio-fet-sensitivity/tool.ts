import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedBioAnalyteConcentrations: readonly number[];
  readonly observedBioFetResponsesV: readonly number[];
}>;
export type Output = Readonly<{
  readonly measuredBioFetVoltsPerDecade: number;
  readonly responseInterceptV: number;
  readonly bioFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedBioAnalyteConcentrations",
    label: "Observed bio analyte concentrations",
    kind: "numberList",
  },
  {
    id: "observedBioFetResponsesV",
    label: "Observed bio fet responses v",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBioAnalyteConcentrations.forEach((v) =>
    positive(v, "observedBioAnalyteConcentrations"),
  );
  const fit = linearFit(
    input.observedBioAnalyteConcentrations.map(Math.log10),
    input.observedBioFetResponsesV,
  );
  return {
    measuredBioFetVoltsPerDecade: fit.slope,
    responseInterceptV: fit.intercept,
    bioFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBioAnalyteConcentrations: [1, 10, 100],
  observedBioFetResponsesV: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  measuredBioFetVoltsPerDecade: 1,
  responseInterceptV: 1,
  bioFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/bio-fet-sensitivity",
  title: "Semiconductor Bio Fet Sensitivity Calculator",
  description:
    "Extract actual BioFET response versus log10 independently assayed analyte concentration, signed slope and fit evidence; not diagnostic sensitivity/specificity, analyte identity or clinical detection.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredBioFetVoltsPerDecade",
      label: "Measured bio fet volts per decade",
      kind: "number",
    },
    { id: "responseInterceptV", label: "Response intercept v", kind: "number" },
    { id: "bioFitRSquared", label: "Bio fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedBioAnalyteConcentrations:
        value.observedBioAnalyteConcentrations as readonly number[],
      observedBioFetResponsesV:
        value.observedBioFetResponsesV as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
