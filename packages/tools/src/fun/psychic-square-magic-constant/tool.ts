import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualNormalMagicSquareOrder: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNormalMagicSquareOrder",
    label: "Actual normal magic square order",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualNormalMagicSquareOrder,
    "actualNormalMagicSquareOrder",
    1,
    1000000,
  );
  bounded(input.actualNormalMagicSquareOrder, "n", 1, 1000);
  if (input.actualNormalMagicSquareOrder === 2)
    simpleError("order", "Normal2×2magicsquaredoesnotexist.");
  return {
    value:
      (input.actualNormalMagicSquareOrder *
        (input.actualNormalMagicSquareOrder ** 2 + 1)) /
      2,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualNormalMagicSquareOrder: 3 },
  output: { result: { value: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/psychic-square-magic-constant",
  title: "Psychic Square Magic Constant Calculator",
  description:
    "Exactnormaln\u00d7nmagicsquarelineconstantn(n\u00b2+1)/2,n\u22641000;not psychicpredictionor existence/constructionsquareaudit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
