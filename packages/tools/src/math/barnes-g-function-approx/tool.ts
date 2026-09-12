import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  factorial,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualPositiveIntegerArgument: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPositiveIntegerArgument",
    label: "Actual positive integer argument",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualPositiveIntegerArgument, "argument", 1, 128);
  let a = 1n;
  for (let k = 0; k < input.actualPositiveIntegerArgument - 1; k++)
    a *= factorial(k);
  return { exactBarnesG: a.toString() };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPositiveIntegerArgument: 5 },
  output: { result: { exactBarnesG: "12" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/barnes-g-function-approx",
  title: "Barnes G-Function Approximation",
  description:
    "RestrictedexactBarnesGpositiveintegerG(n)=\u03a0k!, k=0\u2026n\u22122, G(1)=1, n\u2264128, no complex continuation. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
