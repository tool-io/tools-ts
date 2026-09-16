import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  scalarText,
  utf8,
} from "../batch53-shared.js";

export type Input = Readonly<{ text: string; byteOffset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "byteOffset", label: "Byte offset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  scalarText(i.text);
  bounded(i.byteOffset, "byte-offset", 0, utf8(i.text));
  let bytes = 0,
    j = 0;
  for (const c of i.text) {
    if (bytes === i.byteOffset) break;
    bytes += utf8(c);
    j++;
    if (bytes > i.byteOffset)
      simpleError("byteOffset", "Offset must be a UTF-8 scalar boundary.");
  }
  return { codePointIndex: j };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "A😀B", byteOffset: 5 },
  output: { result: { codePointIndex: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/utf8-byte-offset-to-codepoint-index",
  title: "UTF-8 Byte Offset to Code Point Index",
  description:
    "Convert UTF-8 byte offset to zero-based Unicode scalar index; reject unpaired surrogates and offsets inside multibyte encodings.",
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
