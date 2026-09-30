import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ pointer: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pointer", label: "Pointer", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const tokens = H.pointer(i.pointer);
  return H.finish({
    root: tokens.length === 0,
    emptyMemberTokenIndices: tokens.flatMap((t, j) => (t === "" ? [j] : [])),
    tokenCount: tokens.length,
  });
};
export const example = {
  input: { pointer: "/" },
  output: {
    result: { root: false, emptyMemberTokenIndices: [0], tokenCount: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-pointer-empty-token-label",
  title: "JSON: JSON Pointer Empty Token Label Tool",
  description:
    "Distinguish a root pointer from empty member-name tokens using the existing strict RFC6901 token parser.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          emptyMemberTokenIndices: { type: "array", items: { type: "number" } },
          root: { type: "boolean" },
          tokenCount: { type: "number" },
        },
        required: ["emptyMemberTokenIndices", "root", "tokenCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
