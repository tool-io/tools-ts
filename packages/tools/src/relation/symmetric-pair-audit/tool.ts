import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  pairsJson: string;
  universe: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pairsJson", kind: "string", label: "pairsJson" },
  { id: "universe", kind: "stringList", label: "universe" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.relation(i.pairsJson, i.universe);
  const witnesses = p.filter(([a, b]) => !H.hasPair(p, b, a));
  return H.finish({ holds: witnesses.length === 0, witnesses });
};
export const example = {
  input: { pairsJson: '[["a","b"],["b","a"]]', universe: ["a", "b"] },
  output: { result: { holds: true, witnesses: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/symmetric-pair-audit",
  title: "Finite Relation Symmetric Pair Audit",
  description:
    "Audit finite relation symmetry and return explicit failing witnesses; unknown universe elements are rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          holds: { type: "boolean" },
          witnesses: {
            type: "array",
            items: {
              type: "array",
              items: { type: "string" },
              minItems: 2,
              maxItems: 2,
            },
          },
        },
        required: ["holds", "witnesses"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
