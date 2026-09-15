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
        standard:
          "Opening information depends on dictionary, prior word distribution and hard-mode constraints; no universal best opener.",
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
  input: { context: "standard" },
  output: {
    result: {
      reference:
        "Opening information depends on dictionary, prior word distribution and hard-mode constraints; no universal best opener.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/wordle-openers-information-note-lookup",
  title: "Wordle Openers Information Note",
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
