import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly svgPathText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "svgPathText", label: "Svg path text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.svgPathText.length > 8192 ||
    /[^MmLlHhVvCcSsQqTtAaZz0-9eE+.,\s-]/.test(input.svgPathText)
  )
    simpleError(
      "path",
      "Bounded SVG path-character inventory required; not a full SVG grammar validator.",
    );
  const commandCount = (
      input.svgPathText.match(/[MmLlHhVvCcSsQqTtAaZz]/g) || []
    ).length,
    numbers = (
      input.svgPathText.match(/[+-]?(?:\d*\.\d+|\d+)(?:[eE][+-]?\d+)?/g) || []
    ).length;
  return { lexicalCommandCount: commandCount, numericLiteralCount: numbers };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { svgPathText: "M0 0 L10 0 L10 10 Z" },
  output: { result: { lexicalCommandCount: 4, numericLiteralCount: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/shield-svg-complexity-rater",
  title: "Shield Outline SVG Path Complexity Rater",
  description:
    "Lexical command/numeric-token complexity of supplied shield path text, not rendered curvature, self-intersection or SVG grammar validity.",
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
