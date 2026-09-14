import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly lowToHighPitchNames: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "lowToHighPitchNames",
    label: "Low to high pitch names",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.lowToHighPitchNames.length !== 6)
    simpleError("strings", "Six strings in low-to-high order.");
  return {
    matchesDropD: i.lowToHighPitchNames.join(" ") === "D2 A2 D3 G3 B3 E4",
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { lowToHighPitchNames: ["D2", "A2", "D3", "G3", "B3", "E4"] },
  output: { result: { matchesDropD: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/drop-d-tuning-checker",
  title: "Drop-D Tuning Checker",
  description:
    "Exact pitch-name inventory screen for six-string Drop D; does not analyze recorded pitch.",
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
