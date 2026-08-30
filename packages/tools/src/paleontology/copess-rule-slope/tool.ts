import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesMyrForward: readonly number[];
  readonly measuredBodySizes: readonly number[];
}>;
export type Output = Readonly<{
  readonly logSizeChangePerMyr: number;
  readonly multiplicativeSizeChangePerMyr: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesMyrForward", label: "Times myr forward", kind: "numberList" },
  { id: "measuredBodySizes", label: "Measured body sizes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredBodySizes.forEach((v) => positive(v, "measuredBodySizes"));
  ordered(input.timesMyrForward, "timesMyrForward");
  const fit = regression(
    input.timesMyrForward,
    input.measuredBodySizes.map(Math.log),
  );
  return {
    logSizeChangePerMyr: fit.slope,
    multiplicativeSizeChangePerMyr: Math.exp(fit.slope),
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMyrForward: [0, 1, 2],
  measuredBodySizes: [1, 2.718281828459045, 7.38905609893065],
} satisfies Input;
export const exampleOutput = {
  logSizeChangePerMyr: 1,
  multiplicativeSizeChangePerMyr: 2.718281828459045,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/copess-rule-slope",
  title: "Cope's Rule Size Trend Slope",
  description:
    "Fit signed log body-size trend on an explicit increasing forward-time axis and report multiplicative change; sampling, taxonomic replacement and phylogeny can confound any Cope-rule interpretation.",
  inputs: inputFields,
  outputs: [
    {
      id: "logSizeChangePerMyr",
      label: "Log size change per myr",
      kind: "number",
    },
    {
      id: "multiplicativeSizeChangePerMyr",
      label: "Multiplicative size change per myr",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMyrForward: value.timesMyrForward as readonly number[],
      measuredBodySizes: value.measuredBodySizes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
