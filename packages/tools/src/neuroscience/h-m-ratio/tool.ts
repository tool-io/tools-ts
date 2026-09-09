import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredHmaxMv: number;
  readonly independentlyMatchedMmaxMv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredHmaxMv",
    label: "Independently measured hmax mv",
    kind: "number",
  },
  {
    id: "independentlyMatchedMmaxMv",
    label: "Independently matched mmax mv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredHmaxMv, "numerator");
  positive(input.independentlyMatchedMmaxMv, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredHmaxMv) /
      input.independentlyMatchedMmaxMv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredHmaxMv: 2, independentlyMatchedMmaxMv: 4 },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/h-m-ratio",
  title: "H/M Ratio Calculator",
  description:
    "Actual Hmax/Mmaxpaired amplitude ratio, not a stimulation prescription or clinical norm. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
