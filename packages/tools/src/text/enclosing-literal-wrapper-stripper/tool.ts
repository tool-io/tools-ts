import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; prefix: string; suffix: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "prefix", label: "Prefix", kind: "string" },
  { id: "suffix", label: "Suffix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.prefix || !i.suffix) simpleError("wrapper", "Nonempty wrapper sides.");
  const stripped =
    i.text.length >= i.prefix.length + i.suffix.length &&
    i.text.startsWith(i.prefix) &&
    i.text.endsWith(i.suffix);
  return {
    stripped,
    text: stripped
      ? i.text.slice(i.prefix.length, i.text.length - i.suffix.length)
      : i.text,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "[a]", prefix: "[", suffix: "]" },
  output: { result: { stripped: true, text: "a" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/enclosing-literal-wrapper-stripper",
  title: "Enclosing Literal Wrapper Stripper",
  description:
    "Strip one complete nonoverlapping enclosing literal wrapper, never internal or partial matches.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
