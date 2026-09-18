import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: string;
  right: string;
  leftParametersJson: string;
  rightParametersJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "string" },
  { id: "right", label: "right", kind: "string" },
  { id: "leftParametersJson", label: "leftParametersJson", kind: "string" },
  { id: "rightParametersJson", label: "rightParametersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.media(i.left),
    b = H.media(i.right),
    p = H.parameterRecords(i.leftParametersJson),
    q = H.parameterRecords(i.rightParametersJson);
  return H.finish({
    sameType: a.type === b.type && a.subtype === b.subtype,
    sameOrderedParameters: JSON.stringify(p) === JSON.stringify(q),
  });
};
export const example = {
  input: {
    left: "Text/HTML",
    right: "text/html",
    leftParametersJson: '[{"name":"A","value":"x"}]',
    rightParametersJson: '[{"name":"a","value":"x"}]',
  },
  output: { result: { sameType: true, sameOrderedParameters: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/media-type-record-equality",
  title: "Media Type Record Equality",
  description:
    "Compare case-insensitive type/subtype and exact ordered decoded parameter records separately; not semantic media-type equivalence or parameter reordering/case normalization.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
