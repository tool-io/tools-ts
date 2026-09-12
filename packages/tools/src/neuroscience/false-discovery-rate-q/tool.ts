import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFamilyPValues: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFamilyPValues",
    label: "Actual family p values",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualFamilyPValues.length)
    simpleError("pvalues", "Actualcompletefamily.");
  input.actualFamilyPValues.forEach((v) => fraction(v, "p"));
  const ii = input.actualFamilyPValues
      .map((_, i) => i)
      .sort(
        (a, b) => input.actualFamilyPValues[a] - input.actualFamilyPValues[b],
      ),
    out = Array(ii.length).fill(0) as number[];
  let q = 1;
  for (let k = ii.length - 1; k >= 0; k--) {
    q = Math.min(q, (input.actualFamilyPValues[ii[k]] * ii.length) / (k + 1));
    out[ii[k]] = q;
  }
  return { bhAdjustedPValues: out };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFamilyPValues: [0.01, 0.04, 0.2] },
  output: { result: { bhAdjustedPValues: [0.03, 0.06, 0.2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/false-discovery-rate-q",
  title: "False Discovery Rate Q Calculator",
  description:
    "Benjamini\u2013Hochbergadjusted family pvaluesmonotone reversecummin(p*m/rank), original order retained. Not Storeyqestimated\u03c00; independence/PRDS conditions or other corrections external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
