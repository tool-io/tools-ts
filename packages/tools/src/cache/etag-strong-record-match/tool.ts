import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "string" },
  { id: "right", label: "right", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.tag(i.left),
    b = H.tag(i.right);
  return H.finish({
    matches: a.opaqueValue === b.opaqueValue && !a.weak && !b.weak,
  });
};
export const example = {
  input: { left: 'W/"a"', right: '"a"' },
  output: { result: { matches: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cache/etag-strong-record-match",
  title: "Entity Tag Strong Record Match",
  description:
    "Compare two explicitly parsed entity tags using RFC strong comparison; no wildcard conditional request or resource-state inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
