import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  startMarker: string;
  endMarker: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "startMarker", label: "Start marker", kind: "string" },
  { id: "endMarker", label: "End marker", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.startMarker || !i.endMarker)
    simpleError("markers", "Nonempty markers.");
  const extracted: { start: number; end: number; text: string }[] = [];
  let cursor = 0,
    unclosedStart: number | null = null;
  while (true) {
    const a = i.text.indexOf(i.startMarker, cursor);
    if (a < 0) break;
    const start = a + i.startMarker.length,
      end = i.text.indexOf(i.endMarker, start);
    if (end < 0) {
      unclosedStart = a;
      break;
    }
    extracted.push({ start, end, text: i.text.slice(start, end) });
    cursor = end + i.endMarker.length;
  }
  return { extracted, unclosedStart };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "x[a]y[b]", startMarker: "[", endMarker: "]" },
  output: {
    result: {
      extracted: [
        { start: 2, end: 3, text: "a" },
        { start: 6, end: 7, text: "b" },
      ],
      unclosedStart: null,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/marker-delimited-extractor",
  title: "Marker Delimited Text Extractor",
  description:
    "Extract nonnested first-close marker-delimited content with source spans and an explicit unclosed marker offset.",
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
