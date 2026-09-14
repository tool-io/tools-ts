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
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context),
    pool = [
      "Truth: Share a favorite book",
      "Dare: Draw a friendly robot",
      "Truth: Name a joyful memory",
      "Dare: Invent a silly handshake",
      "Truth: Describe your ideal picnic",
      "Dare: Hum a tune",
    ];
  return {
    selectedTexts: indices(pool.length, input, random).map((i) => pool[i]),
    samplingConvention: input.withoutReplacement
      ? "uniform-position-without-replacement"
      : "uniform-with-replacement",
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
  input: { seed: "batch51-example", count: 2, withoutReplacement: false },
  output: {
    result: {
      selectedTexts: [
        "Truth: Share a favorite book",
        "Dare: Invent a silly handshake",
      ],
      samplingConvention: "uniform-with-replacement",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/truth-or-dare",
  title: "Truth or Dare Prompt Generator",
  description:
    "Bounded offline consensual safe truth-or-dare prompts,skipping always allowed. Uses one advancing source and existing random-index calculation;explicit replacement,at most64draws,infeasibleunique requestsrejected. Repertoireis original illustrative entertainment,not completecanon,personaltraitinference,secure randomness or predictive truth.",
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
