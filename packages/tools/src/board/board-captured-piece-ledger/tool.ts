import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ eventsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "eventsJson", kind: "string", label: "eventsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.eventsJson).map((v) => ({
    side: H.str(v.side),
    piece: H.str(v.piece),
    count: H.int(H.num(v.count), 1, 1e6),
  }));
  return H.finish({
    ledger: H.groups(r, (v) => JSON.stringify([v.side, v.piece])).map((g) => ({
      side: r[g.indexes[0]].side,
      piece: r[g.indexes[0]].piece,
      count: g.indexes.reduce((s, j) => s + r[j].count, 0),
    })),
  });
};
export const example = {
  input: {
    eventsJson:
      '[{"side":"white","piece":"pawn","count":1},{"side":"white","piece":"pawn","count":2}]',
  },
  output: { result: { ledger: [{ side: "white", piece: "pawn", count: 3 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-captured-piece-ledger",
  title: "Board Captured Piece Ledger",
  description:
    "Aggregate explicit captured-piece events by side and piece name; no inferred moves, scoring or game legality.",
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
          ledger: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                side: { type: "string" },
                piece: { type: "string" },
                count: { type: "number" },
              },
              required: ["side", "piece", "count"],
            },
          },
        },
        required: ["ledger"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
