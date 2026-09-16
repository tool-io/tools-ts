import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  openMarker: string;
  closeMarker: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "openMarker", label: "Open marker", kind: "string" },
  { id: "closeMarker", label: "Close marker", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.openMarker || !i.closeMarker)
    simpleError("markers", "Nonempty markers.");
  const names: string[] = [],
    spans: number[][] = [];
  let cursor = 0;
  while (true) {
    const a = i.text.indexOf(i.openMarker, cursor);
    if (a < 0) break;
    const b = i.text.indexOf(i.closeMarker, a + i.openMarker.length);
    if (b < 0) break;
    names.push(i.text.slice(a + i.openMarker.length, b));
    spans.push([a, b + i.closeMarker.length]);
    cursor = b + i.closeMarker.length;
  }
  return { names, spans, uniqueNames: [...new Set(names)] };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "{x}{x}{y}", openMarker: "{", closeMarker: "}" },
  output: {
    result: {
      names: ["x", "x", "y"],
      spans: [
        [0, 3],
        [3, 6],
        [6, 9],
      ],
      uniqueNames: ["x", "y"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/literal-placeholder-inventory",
  title: "Literal Placeholder Inventory",
  description:
    "Inventory nonnested literal placeholders, preserving repeated names and source spans; does not parse a programming template language.",
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
