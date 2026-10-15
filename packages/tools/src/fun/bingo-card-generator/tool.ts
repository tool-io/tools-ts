import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sourceFor,
  indices,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  return {
    columns: [0, 1, 2, 3, 4].map((c) =>
      indices(
        15,
        { seed: input.seed, count: 5, withoutReplacement: true },
        random,
      ).map((v, r) => (c === 2 && r === 2 ? 0 : c * 15 + v + 1)),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51" },
  output: {
    result: {
      columns: [
        [7, 6, 10, 4, 5],
        [17, 21, 16, 20, 18],
        [43, 32, 0, 38, 42],
        [52, 56, 58, 50, 48],
        [70, 68, 74, 67, 61],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/bingo-card-generator",
  title: "Bingo Card Generator",
  description:
    "US75-ball5\u00d75bingocardCOLUMN-majorB,I,N,G,O;center0FREE,unique sampledpositions percolumn. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
          columns: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["columns"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
