import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly piece: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "piece", label: "Piece", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.piece,
      {
        pawn: 1,
        knight: 3,
        bishop: 3,
        rook: 5,
        queen: 9,
        king: "not assigned a tradable material value",
      },
      "piece",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { piece: "queen" },
  output: { result: { reference: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-piece-value-traditional-lookup",
  title: "Chess Piece Value Traditional Lookup",
  description:
    "Illustrative traditional chess material points, not a position evaluation or game outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reference: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
