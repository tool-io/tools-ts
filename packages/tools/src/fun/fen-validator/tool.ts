import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualFen: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualFen", label: "Actual fen", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const p = input.actualFen.trim().split(/\s+/);
  if (p.length !== 6) simpleError("FEN", "Actualsixfields.");
  const ranks = p[0].split("/");
  if (
    ranks.length !== 8 ||
    ranks.some((r) => {
      let n = 0;
      for (const c of r) {
        if (/[1-8]/.test(c)) n += Number(c);
        else if (/[prnbqkPRNBQK]/.test(c)) n++;
        else return true;
      }
      return n !== 8;
    })
  )
    simpleError("board", "ActualeightcompleteFENranks.");
  if (
    !/^[wb]$/.test(p[1]) ||
    !/^(-|K?Q?k?q?)$/.test(p[2]) ||
    !p[2] ||
    !/^(-|[a-h][36])$/.test(p[3]) ||
    !/^(0|[1-9][0-9]*)$/.test(p[4]) ||
    !/^[1-9][0-9]*$/.test(p[5])
  )
    simpleError("fields", "ActualFENtokens/counters.");
  if (
    (p[0].match(/K/g) || []).length !== 1 ||
    (p[0].match(/k/g) || []).length !== 1
  )
    simpleError("kings", "Actualexactlyonekingpercolor.");
  return { validDeclaredFenSyntax: true };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualFen: "8/8/8/8/8/8/8/K6k w - - 0 1" },
  output: { result: { validDeclaredFenSyntax: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/fen-validator",
  title: "Chess Puzzle FEN Validator",
  description:
    "FENsyntax/eight-rankwidth/side/castling/ep/counters andonekingeachinventoryONLY,not legalreachability/check/pawnpromotions/castlingvalidity. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { validDeclaredFenSyntax: { type: "boolean" } },
        required: ["validDeclaredFenSyntax"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
