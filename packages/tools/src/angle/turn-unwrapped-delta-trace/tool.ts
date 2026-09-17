import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ turns: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "turns", label: "turns", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  let value = i.turns[0] ?? 0;
  return H.finish({
    unwrapped: i.turns.length
      ? [
          i.turns[0],
          ...i.turns.slice(1).map((x, j) => {
            value += H.shortTurn(i.turns[j], x);
            return value;
          }),
        ]
      : [],
  });
};
export const example = {
  input: { turns: [0.9, 0.1, 0.3] },
  output: { result: { unwrapped: [0.9, 1.1, 1.3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "angle/turn-unwrapped-delta-trace",
  title: "Turn Unwrapped Delta Trace",
  description:
    "Unwrap supplied turn observations using shortest signed consecutive increments; exact half-turn ties go positive and larger actual motion cannot be recovered.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
