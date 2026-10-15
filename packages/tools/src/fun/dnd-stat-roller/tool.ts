import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sum,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly statCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "statCount", label: "Stat count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  bounded(input.statCount, "stats", 1, 16);
  const rolls = Array.from({ length: input.statCount }, () =>
    Array.from({ length: 4 }, () => draw(1, 6, random)),
  );
  return { rolls, stats: rolls.map((r) => sum(r) - Math.min(...r)) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", statCount: 2 },
  output: {
    result: {
      rolls: [
        [3, 3, 4, 2],
        [3, 1, 3, 1],
      ],
      stats: [10, 7],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/dnd-stat-roller",
  title: "D&D Stat Roller 4d6 Drop Lowest",
  description:
    "4d6droplowestindependentstats,one advancingsource,actualfourrollsretained;no officialcharactercreationpolicy. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
          rolls: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          stats: { type: "array", items: { type: "number" } },
        },
        required: ["rolls", "stats"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
