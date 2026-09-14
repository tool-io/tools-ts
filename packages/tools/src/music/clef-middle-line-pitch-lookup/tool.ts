import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly clef: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clef", label: "Clef", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.clef,
      { treble: "B4", bass: "D3", alto: "C4", tenor: "A3" },
      "clef",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { clef: "alto" },
  output: { result: { reference: "C4" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/clef-middle-line-pitch-lookup",
  title: "Clef Middle-Line Pitch Lookup",
  description:
    "Middle staff-line pitch for four standard clefs without octave displacement.",
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
