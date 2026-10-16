import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ pairsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pairsJson", label: "pairsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.pairsJson);
  r.forEach((v) => {
    H.str(v.left);
    H.str(v.right);
    H.num(v.adjustment);
  });
  return H.finish({
    conflicts: H.groups(r, (v) => JSON.stringify([v.left, v.right])).filter(
      (g) => H.unique(g.indexes.map((j) => r[j].adjustment)).length > 1,
    ),
  });
};
export const example = {
  input: {
    pairsJson:
      '[{"left":"a","right":"b","adjustment":-1},{"left":"a","right":"b","adjustment":-2}]',
  },
  output: { result: { conflicts: [{ key: '["a","b"]', indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Glyph Pair Adjustment Conflict Audit", "typography", "Unicode"],
    collections: ["data", "learn"],
    fields: ["glyph", "typography", "Unicode"],
    keywords: ["typography", "Unicode"],
  },
  id: "glyph/glyph-pair-adjustment-conflict-audit",
  title: "Glyph Pair Adjustment Conflict Audit",
  description:
    "Audit conflicting caller pair-adjustment observations by exact ordered glyph ID pair; repeated equal values are not conflicts.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conflicts: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["conflicts"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
