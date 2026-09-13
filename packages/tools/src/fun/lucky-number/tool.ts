import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly minimum: number;
  readonly maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "minimum", label: "Minimum", kind: "number" },
  { id: "maximum", label: "Maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.minimum, "min", 0, 1000000);
  bounded(input.maximum, "max", input.minimum, 1000000);
  return {
    entertainmentLuckyNumber: draw(input.minimum, input.maximum, random),
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
  input: { seed: "batch51", minimum: 1, maximum: 99 },
  output: {
    result: {
      entertainmentLuckyNumber: 41,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/lucky-number",
  title: "Lucky Number Generator",
  description:
    "Toyuniformlucky-numberdraw,not number-theorylucky sieveor actual luckprediction. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
