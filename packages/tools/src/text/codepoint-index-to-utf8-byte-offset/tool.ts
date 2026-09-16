import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  scalarText,
  utf8,
} from "../batch53-shared.js";

export type Input = Readonly<{ text: string; codePointIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "codePointIndex", label: "Code point index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  scalarText(i.text);
  const a = [...i.text];
  bounded(i.codePointIndex, "index", 0, a.length);
  return { byteOffset: utf8(a.slice(0, i.codePointIndex).join("")) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "A😀B", codePointIndex: 2 },
  output: { result: { byteOffset: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/codepoint-index-to-utf8-byte-offset",
  title: "Code Point Index to UTF-8 Byte Offset",
  description:
    "Convert zero-based Unicode scalar index to UTF-8 byte offset; reject unpaired surrogates and count scalars rather than grapheme clusters.",
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
