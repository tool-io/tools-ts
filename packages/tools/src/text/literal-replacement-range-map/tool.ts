import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, occurrences } from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  needle: string;
  replacement: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "needle", label: "Needle", kind: "string" },
  { id: "replacement", label: "Replacement", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = occurrences(i.text, i.needle, false);
  let delta = 0;
  return {
    ranges: a.map((start) => {
      const targetStart = start + delta;
      delta += i.replacement.length - i.needle.length;
      return {
        sourceStart: start,
        sourceEnd: start + i.needle.length,
        targetStart,
        targetEnd: targetStart + i.replacement.length,
      };
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "aba", needle: "a", replacement: "xy" },
  output: {
    result: {
      ranges: [
        { sourceStart: 0, sourceEnd: 1, targetStart: 0, targetEnd: 2 },
        { sourceStart: 2, sourceEnd: 3, targetStart: 3, targetEnd: 5 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/literal-replacement-range-map",
  title: "Literal Replacement Range Map",
  description:
    "Map nonoverlapping literal replacements between original and resulting UTF-16 ranges, without repeatedly replacing inserted text.",
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
