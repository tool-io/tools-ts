import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ beforeJson: string; afterJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "beforeJson", kind: "string", label: "beforeJson" },
  { id: "afterJson", kind: "string", label: "afterJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const b = H.multiset(i.beforeJson),
    a = H.multiset(i.afterJson),
    keys = H.unique([...b.keys(), ...a.keys()]);
  return H.finish({
    changes: keys
      .map((k) => ({
        value: (a.get(k) ?? b.get(k))!.value,
        delta: (a.get(k)?.count ?? 0) - (b.get(k)?.count ?? 0),
      }))
      .filter((v) => v.delta !== 0),
  });
};
export const example = {
  input: {
    beforeJson: '[{"value":"pawn","count":3}]',
    afterJson: '[{"value":"pawn","count":1},{"value":"queen","count":1}]',
  },
  output: {
    result: {
      changes: [
        { value: "pawn", delta: -2 },
        { value: "queen", delta: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-token-inventory-delta",
  title: "Board Token Inventory Delta",
  description:
    "Report signed board token inventory changes between explicit typed count observations; does not infer captures, promotions or legality.",
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
          changes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" },
                  ],
                },
                delta: { type: "number" },
              },
              required: ["value", "delta"],
            },
          },
        },
        required: ["changes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
