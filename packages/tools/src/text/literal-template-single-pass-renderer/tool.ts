import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  unique,
} from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  openMarker: string;
  closeMarker: string;
  names: readonly string[];
  values: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "openMarker", label: "Open marker", kind: "string" },
  { id: "closeMarker", label: "Close marker", kind: "string" },
  { id: "names", label: "Names", kind: "stringList" },
  { id: "values", label: "Values", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.openMarker || !i.closeMarker || i.names.length !== i.values.length)
    simpleError("template", "Markers and aligned substitution table.");
  unique(i.names, "names");
  let cursor = 0,
    out = "";
  const unresolved: string[] = [];
  while (true) {
    const a = i.text.indexOf(i.openMarker, cursor);
    if (a < 0) {
      out += i.text.slice(cursor);
      break;
    }
    const b = i.text.indexOf(i.closeMarker, a + i.openMarker.length);
    if (b < 0) {
      out += i.text.slice(cursor);
      break;
    }
    const end = b + i.closeMarker.length,
      name = i.text.slice(a + i.openMarker.length, b),
      j = i.names.indexOf(name);
    out +=
      i.text.slice(cursor, a) + (j < 0 ? i.text.slice(a, end) : i.values[j]);
    if (j < 0) unresolved.push(name);
    cursor = end;
  }
  return { text: out, unresolvedNames: unresolved };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    text: "{a}{b}",
    openMarker: "{",
    closeMarker: "}",
    names: ["a"],
    values: ["{b}"],
  },
  output: { result: { text: "{b}{b}", unresolvedNames: ["b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/literal-template-single-pass-renderer",
  title: "Single Pass Literal Template Renderer",
  description:
    "Render a single pass of literal placeholders from an explicit unique name/value table; inserted placeholders are not recursively expanded.",
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
