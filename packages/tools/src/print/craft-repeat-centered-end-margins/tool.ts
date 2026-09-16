import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  length: number;
  repeatLength: number;
  repeats: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", kind: "number", label: "length" },
  { id: "repeatLength", kind: "number", label: "repeatLength" },
  { id: "repeats", kind: "integer", label: "repeats" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.length >= 0);
  H.positive(i.repeatLength);
  H.int(i.repeats);
  const remainder = i.length - i.repeatLength * i.repeats;
  return H.finish({ margin: remainder / 2, fits: remainder >= 0, remainder });
};
export const example = {
  input: { length: 25, repeatLength: 6, repeats: 3 },
  output: { result: { margin: 3.5, fits: true, remainder: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/craft-repeat-centered-end-margins",
  title: "Craft Repeat Centered End Margins",
  description:
    "Center an explicitly chosen number of craft repeats in a length budget; negative margins retain oversize evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
