import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch53-shared.js";

export type Input = Readonly<{ recessiveHomozygoteFraction: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "recessiveHomozygoteFraction",
    label: "Recessive homozygote fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  fraction(i.recessiveHomozygoteFraction, "q2");
  const q = Math.sqrt(i.recessiveHomozygoteFraction);
  return { q, p: 1 - q, assumption: "biallelic-Hardy-Weinberg" };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { recessiveHomozygoteFraction: 0.25 },
  output: {
    result: { q: 0.5, p: 0.5, assumption: "biallelic-Hardy-Weinberg" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/allele-p-from-q2-sqrt-solver",
  title: "Allele Frequency p from Homozygote Recessive q2 Square Root Solver",
  description:
    "Solve p=1−sqrt(q²) conditionally under biallelic Hardy-Weinberg equilibrium; not direct allele counting.",
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
