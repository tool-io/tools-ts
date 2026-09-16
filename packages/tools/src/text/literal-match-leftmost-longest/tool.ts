import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; needles: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "needles", label: "Needles", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.needles.length || i.needles.some((v) => !v.length))
    simpleError("needles", "Nonempty literal alternatives.");
  const selected: { offset: number; needleIndex: number; text: string }[] = [];
  for (let j = 0; j < i.text.length;) {
    const a = i.needles
      .flatMap((v, k) => (i.text.startsWith(v, j) ? [k] : []))
      .sort((x, y) => i.needles[y].length - i.needles[x].length || x - y);
    if (a.length) {
      const k = a[0];
      selected.push({ offset: j, needleIndex: k, text: i.needles[k] });
      j += i.needles[k].length;
    } else j++;
  }
  return { selected };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "ababa", needles: ["a", "ab"] },
  output: {
    result: {
      selected: [
        { offset: 0, needleIndex: 1, text: "ab" },
        { offset: 2, needleIndex: 1, text: "ab" },
        { offset: 4, needleIndex: 0, text: "a" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/literal-match-leftmost-longest",
  title: "Leftmost Longest Literal Match Selector",
  description:
    "Select nonoverlapping leftmost-longest literal alternatives; equal lengths retain input alternative order.",
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
