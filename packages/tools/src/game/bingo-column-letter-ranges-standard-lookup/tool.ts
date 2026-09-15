import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly column: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "column", label: "Column", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.column,
      { B: [1, 15], I: [16, 30], N: [31, 45], G: [46, 60], O: [61, 75] },
      "column",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { column: "N" },
  output: { result: { reference: [31, 45] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/bingo-column-letter-ranges-standard-lookup",
  title: "Bingo Column Letter Ranges Standard",
  description:
    "Standard US 75-ball bingo column number ranges; center free-space card construction excluded.",
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
