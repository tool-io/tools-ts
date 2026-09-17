import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ turns: readonly number[]; tolerance: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "turns", label: "turns", kind: "numberList" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.tolerance >= 0 && i.tolerance <= 0.5);
  return H.finish({
    ambiguousSteps: i.turns
      .slice(1)
      .flatMap((x, j) =>
        Math.abs(Math.abs(H.shortTurn(i.turns[j], x)) - 0.5) <= i.tolerance
          ? [j + 1]
          : [],
      ),
  });
};
export const example = {
  input: { turns: [0, 0.5, 0.6], tolerance: 0 },
  output: { result: { ambiguousSteps: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "angle/turn-direction-ambiguity-audit",
  title: "Turn Direction Ambiguity Audit",
  description:
    "Audit exact or caller-tolerance antipodal angular transitions where shortest direction is ambiguous; no motion-direction inference from sparse samples.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
