import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  sourceFor,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualParticipants: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "actualParticipants",
    label: "Actual participants",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  unique(input.actualParticipants, "participants");
  return { turnOrder: shuffle(input.actualParticipants, random) };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", actualParticipants: ["A", "B", "C"] },
  output: {
    result: {
      turnOrder: ["C", "A", "B"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/white-elephant-order",
  title: "White Elephant Order Shuffler",
  description:
    "UniformFisher\u2013Yateswhite-elephantturnorder,not automate steals,giftsoractualpartypermissions. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
