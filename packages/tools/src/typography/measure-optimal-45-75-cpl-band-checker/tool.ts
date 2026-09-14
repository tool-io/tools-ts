import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{ readonly observedCpl: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedCpl", label: "Observed cpl", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.observedCpl, "cpl");
  return { withinIllustrativeBand: i.observedCpl >= 45 && i.observedCpl <= 75 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedCpl: 60 },
  output: { result: { withinIllustrativeBand: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/measure-optimal-45-75-cpl-band-checker",
  title: "45-75 CPL Optimal Band Check",
  description:
    "Screen observed CPL against an explicitly illustrative inclusive 45–75 band; not universal optimality.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
