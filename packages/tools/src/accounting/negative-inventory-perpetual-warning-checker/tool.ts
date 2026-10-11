import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly openingUnits: number;
  readonly movementUnits: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "openingUnits", label: "Opening units", kind: "number" },
  { id: "movementUnits", label: "Movement units", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.openingUnits, "opening");
  let running = i.openingUnits;
  const balances = i.movementUnits.map((v) => (running += v));
  return {
    runningUnits: balances,
    negativeBalanceMovementIndices: balances.flatMap((v, j) =>
      v < 0 ? [j] : [],
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { openingUnits: 5, movementUnits: [-6, 2] },
  output: {
    result: { runningUnits: [-1, 1], negativeBalanceMovementIndices: [0] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/negative-inventory-perpetual-warning-checker",
  title: "Negative Inventory Perpetual System Warning Checker",
  description:
    "Trace signed perpetual inventory movements and negative balances; warnings not automatically errors or evidence of theft.",
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
          runningUnits: { type: "array", items: { type: "number" } },
          negativeBalanceMovementIndices: {
            type: "array",
            items: { type: "number" },
          },
        },
        required: ["runningUnits", "negativeBalanceMovementIndices"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
