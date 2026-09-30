import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ index: number; length: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "integer" },
  { id: "length", label: "Length", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.length, 0, 1000000);
  H.int(i.index, -1000000, 1000000);
  const resolved = i.index < 0 ? i.length + i.index : i.index;
  return H.finish({
    resolvedIndex: resolved,
    inBounds: resolved >= 0 && resolved < i.length,
  });
};
export const example = {
  input: { index: -1, length: 5 },
  output: { result: { resolvedIndex: 4, inBounds: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/list-negative-index-resolver",
  title: "List: List Negative Index Resolver Tool",
  description:
    "Resolve one Python-style negative element index relative to an explicit list length, retaining out-of-bounds evidence without clamping.",
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
          inBounds: { type: "boolean" },
          resolvedIndex: { type: "number" },
        },
        required: ["inBounds", "resolvedIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
