import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTotalChipCount: number;
  readonly actualPlayerCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualTotalChipCount",
    label: "Actual total chip count",
    kind: "number",
  },
  { id: "actualPlayerCount", label: "Actual player count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualTotalChipCount, "chips", 0, 1000000);
  bounded(input.actualPlayerCount, "players", 1, 64);
  return {
    chipsPerPlayer: Array.from(
      { length: input.actualPlayerCount },
      (_, i) =>
        Math.floor(input.actualTotalChipCount / input.actualPlayerCount) +
        (i < input.actualTotalChipCount % input.actualPlayerCount ? 1 : 0),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualTotalChipCount: 10, actualPlayerCount: 3 },
  output: { result: { chipsPerPlayer: [4, 3, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/poker-chip-split",
  title: "Poker Chip Distribution Calculator",
  description:
    "Exactidenticalchipcountsplitwithstablefirstplayersremainder,nochipdenominationbuy-in/payoutor potodds. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
          chipsPerPlayer: { type: "array", items: { type: "number" } },
        },
        required: ["chipsPerPlayer"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
