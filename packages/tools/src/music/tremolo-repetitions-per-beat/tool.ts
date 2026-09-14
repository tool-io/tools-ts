import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly slashes: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "slashes", label: "Slashes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.slashes, "slashes", 0, 8);
  return { subdivisionsPerQuarter: 2 ** i.slashes };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { slashes: 3 },
  output: { result: { subdivisionsPerQuarter: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/tremolo-repetitions-per-beat",
  title: "Tremolo Repetitions Per Beat",
  description:
    "Unmeasured subdivision count per quarter-note beat for explicit tremolo slash convention; durations/alternating measured tremolos need notation context.",
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
