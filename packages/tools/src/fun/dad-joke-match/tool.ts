import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sourceFor,
  indices,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context),
    pool = [
      "Why did the pencil rest? It had drawn a long day",
      "Why did the clock blush? It saw the second hand",
      "Why did the book travel? It wanted a new chapter",
      "Why did the lamp study? It wanted to be brighter",
      "Why did the bread smile? It had a good rise",
      "Why did the bicycle nap? It was two tired",
    ];
  return {
    selectedTexts: indices(pool.length, input, random).map((i) => pool[i]),
    samplingConvention: input.withoutReplacement
      ? "uniform-position-without-replacement"
      : "uniform-with-replacement",
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51-example", count: 2, withoutReplacement: false },
  output: {
    result: {
      selectedTexts: [
        "Why did the pencil rest? It had drawn a long day",
        "Why did the lamp study? It wanted to be brighter",
      ],
      samplingConvention: "uniform-with-replacement",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/dad-joke-match",
  title: "Dad Joke Punchline Matcher",
  description:
    "Bounded offline dad-joke question/punchline pairs. Uses one advancing source and existing random-index calculation;explicit replacement,at most64draws,infeasibleunique requestsrejected. Repertoireis original illustrative entertainment,not completecanon,personaltraitinference,secure randomness or predictive truth.",
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
          selectedTexts: { type: "array", items: { type: "string" } },
          samplingConvention: { type: "string" },
        },
        required: ["selectedTexts", "samplingConvention"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
