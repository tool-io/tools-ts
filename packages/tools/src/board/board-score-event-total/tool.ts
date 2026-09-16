import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ eventsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eventsJson", kind: "string", label: "eventsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.records(i.eventsJson).map((v) => ({
    player: H.str(v.player),
    points: H.num(v.points),
  }));
  return H.finish({
    players: H.groups(r, (v) => v.player).map((g) => ({
      player: g.key,
      total: g.indexes.reduce((s, j) => s + r[j].points, 0),
    })),
  });
};
export const example = {
  input: {
    eventsJson: '[{"player":"a","points":3},{"player":"a","points":-1}]',
  },
  output: { result: { players: [{ player: "a", total: 2 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-score-event-total",
  title: "Board Score Event Total",
  description:
    "Total explicit signed score events per player, preserving debits; does not validate game-specific scoring rules.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
