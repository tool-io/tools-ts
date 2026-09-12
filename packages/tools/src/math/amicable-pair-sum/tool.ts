import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  aliquot,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFirst: number;
  readonly actualSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFirst", label: "Actual first", kind: "number" },
  { id: "actualSecond", label: "Actual second", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualFirst, "a", 1, 1000000);
  bounded(input.actualSecond, "b", 1, 1000000);
  if (
    input.actualFirst === input.actualSecond ||
    aliquot(input.actualFirst) !== input.actualSecond ||
    aliquot(input.actualSecond) !== input.actualFirst
  )
    simpleError("pair", "Actualdistinctamicablepairrequired.");
  return { verifiedAmicablePairSum: input.actualFirst + input.actualSecond };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFirst: 220, actualSecond: 284 },
  output: { result: { verifiedAmicablePairSum: 504 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/amicable-pair-sum",
  title: "Amicable Pair Sum Calculator",
  description:
    "Sum only after independently recomputedamicablepairrelationss(a)=b/s(b)=a; not existing pair boolean only. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
