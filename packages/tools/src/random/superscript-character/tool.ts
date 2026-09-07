import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import { validateRandomInput, finish, repertoire } from "../batch42-shared.js";
import base from "../../convert/text-to-superscript/tool.js";
const source = {
  values: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
} as const;
export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const drawn = repertoire(source, 10, input, context);
  const values = drawn.result.values.map((text) => {
    const v = base.execute({ text });
    if (!v.ok)
      simpleError("converter", "Existing style converter rejected symbol.");
    return (v.output as { convertedText: string }).convertedText;
  });
  return { result: { ...drawn.result, values, converterId: base.id } };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, withoutReplacement: false },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/superscript-character",
  title: "Random Superscript Character Generator",
  description:
    "Sample explicit supported ASCII letters/digits, then import convert/text-to-superscript for each mapping. Uniform source-entry sampling; no replacement refers to source entries. Superscript/subscript tools intentionally cover decimal digits only; small capitals cover the explicitly listed supported phonetic letters. Not a complete mathematical alphabet or typographic/font guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
