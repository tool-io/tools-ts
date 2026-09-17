import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: string;
  leftPrefix: number;
  right: string;
  rightPrefix: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "leftPrefix", kind: "integer", label: "leftPrefix" },
  { id: "right", kind: "string", label: "right" },
  { id: "rightPrefix", kind: "integer", label: "rightPrefix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    relation: H.ipRelation(
      H.prefix(i.left, i.leftPrefix, 128),
      H.prefix(i.right, i.rightPrefix, 128),
    ),
  });
};
export const example = {
  input: { left: "::", leftPrefix: 126, right: "::2", rightPrefix: 127 },
  output: { result: { relation: "contains" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv6-prefix-relation",
  title: "IPv6 Prefix Relation Classifier",
  description:
    "Classify exact normalized IPv6 prefix set relationships without expanding addresses or inferring routing policy.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
