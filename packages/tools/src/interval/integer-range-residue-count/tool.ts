import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mod } from "../batch53-shared.js";

export type Input = Readonly<{
  start: number;
  end: number;
  modulus: number;
  residue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "modulus", label: "Modulus", kind: "number" },
  { id: "residue", label: "Residue", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.start, "start", -1e12, 1e12);
  bounded(i.end, "end", i.start, 1e12);
  bounded(i.modulus, "modulus", 1, 1e9);
  bounded(i.residue, "residue", 0, i.modulus - 1);
  const first = i.start + mod(i.residue - mod(i.start, i.modulus), i.modulus);
  return {
    count: first > i.end ? 0 : Math.floor((i.end - first) / i.modulus) + 1,
    first: first > i.end ? null : first,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { start: -3, end: 5, modulus: 3, residue: 1 },
  output: { result: { count: 3, first: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/integer-range-residue-count",
  title: "Integer Range Residue Count",
  description:
    "Count congruent integers in an inclusive closed range using Euclidean residues, including negative endpoints.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
