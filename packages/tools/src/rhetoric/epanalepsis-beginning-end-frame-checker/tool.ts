import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  tokenInventory,
} from "../batch43-shared.js";

export type Input = Readonly<{ readonly clause: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clause", label: "Clause", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const t = tokenInventory(input.clause);
  if (t.length < 2)
    simpleError("clause", "At least two explicit lexical tokens.");
  return { exactFrameToken: t[0], frameMatches: t[0] === t.at(-1) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { clause: "home we return home" },
  output: { result: { exactFrameToken: "home", frameMatches: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/epanalepsis-beginning-end-frame-checker",
  title: "Epanalepsis Beginning End Frame Checker",
  description:
    "Compare exact first/last clause words for an epanaleptic frame; no meaning or intention inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
