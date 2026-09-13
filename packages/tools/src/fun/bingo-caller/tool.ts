import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sourceFor,
  indices,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly drawCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "drawCount", label: "Draw count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.drawCount, "count", 1, 64);
  const a = indices(
    75,
    { seed: input.seed, count: input.drawCount, withoutReplacement: true },
    random,
  );
  return { drawnNumbers: a.map((v) => v + 1) };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", drawCount: 3 },
  output: {
    result: {
      drawnNumbers: [31, 27, 43],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/bingo-caller",
  title: "Bingo Number Caller",
  description:
    "US 75-ball bingo 1\u201364 draw numbers withoutreplacement withinONErequest,not persistentcallerhistory Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
