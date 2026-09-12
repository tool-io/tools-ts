import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  bounded,
  modularJ,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQ: number;
  readonly actualHighestPositivePower: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualQ", label: "Actual q", kind: "number" },
  {
    id: "actualHighestPositivePower",
    label: "Actual highest positive power",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualQ, "q");
  if (input.actualQ > 0.05) simpleError("q", "Real0<q≤.05branch.");
  bounded(input.actualHighestPositivePower, "power", 0, 12);
  let a = 1 / input.actualQ + 744;
  for (let k = 1; k <= input.actualHighestPositivePower; k++)
    a += Number(modularJ(k)) * input.actualQ ** k;
  return { truncatedModularJ: a };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualQ: 0.001, actualHighestPositivePower: 0 },
  output: { result: { truncatedModularJ: 1744 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/j-invariant-approx",
  title: "J-Invariant Approximation",
  description:
    "Truncatedstandardmodularj(q)=q^\u22121+744+196884q+\u2026N\u226412, exact coefficients before floating evaluation, not normalizedJ=j/1728, no tail bound. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
