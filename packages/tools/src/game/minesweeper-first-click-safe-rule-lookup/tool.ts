import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly context: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "context", label: "Context", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.context,
      {
        "implementation-dependent":
          "First-click protection is implementation-specific; do not assume a mined click will be relocated.",
      },
      "context",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { context: "implementation-dependent" },
  output: {
    result: {
      reference:
        "First-click protection is implementation-specific; do not assume a mined click will be relocated.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/minesweeper-first-click-safe-rule-lookup",
  title: "Minesweeper First-Click Safe Rule",
  description:
    "Bounded game convention/reference only; does not run an omitted strategy or solver.",
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
