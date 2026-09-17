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
      H.prefix(i.left, i.leftPrefix, 32),
      H.prefix(i.right, i.rightPrefix, 32),
    ),
  });
};
export const example = {
  input: {
    left: "10.0.0.0",
    leftPrefix: 24,
    right: "10.0.0.128",
    rightPrefix: 25,
  },
  output: { result: { relation: "contains" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/ipv4-cidr-relation",
  title: "IPv4 CIDR Relation Classifier",
  description:
    "Classify normalized IPv4 CIDR set relation as equal, contains, contained-by or disjoint; host bits in supplied addresses are masked.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
