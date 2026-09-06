import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { simpleError } from "../batch42-shared.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  bounded,
  sum,
} from "../batch42-shared.js";
import { calculateRandomInteger } from "../number/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly sides: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "sides", label: "Sides", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  bounded(input.count, "dice", 1, 64);
  bounded(input.sides, "sides", 2, 1000000);
  const rolls = Array.from({ length: input.count }, () => {
    const v = calculateRandomInteger(1, input.sides, random);
    if (v === null) simpleError("random", "Existing die sampler failed.");
    return v;
  });
  return {
    result: {
      rolls,
      total: sum(rolls),
      samplingConvention: "independent-uniform-with-replacement",
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: { seed: "tool.io/batch42", count: 1, sides: 6 },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/dice-pool",
  title: "Random Dice Pool Generator",
  description:
    "Roll a bounded pool of caller-sided dice with one advancing source, importing the existing random integer calculation. Each die independent with replacement; no secure or fair physical-roll guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
