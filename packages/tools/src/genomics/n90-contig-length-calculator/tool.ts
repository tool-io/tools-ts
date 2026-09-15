import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
} from "../batch53-shared.js";

export type Input = Readonly<{ contigLengths: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "contigLengths", label: "Contig lengths", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.contigLengths.length) simpleError("contigs", "Observed lengths.");
  i.contigLengths.forEach((v) => bounded(v, "length", 1, 1e12));
  const a = [...i.contigLengths].sort((a, b) => b - a),
    total = sum(a);
  bounded(total, "total-bases", 1, Number.MAX_SAFE_INTEGER);
  let cumulative = 0,
    j = 0;
  while (cumulative < 0.9 * total) cumulative += a[j++];
  return { n90: a[j - 1], l90: j, totalBases: total };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { contigLengths: [5, 3, 2] },
  output: { result: { n90: 2, l90: 3, totalBases: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/n90-contig-length-calculator",
  title: "N90 Contig Length Ninety-Percent Coverage Calculator",
  description:
    "Compute N90/L90 from complete positive contig lengths using at-least-90-percent cumulative assembly coverage; no reference genome size assumption.",
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
