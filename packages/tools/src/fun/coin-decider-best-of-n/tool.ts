import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualOddBestOfCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "actualOddBestOfCount",
    label: "Actual odd best of count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  bounded(input.actualOddBestOfCount, "count", 1, 63);
  if (input.actualOddBestOfCount % 2 === 0)
    simpleError("count", "Oddnumberoftosses.");
  let h = 0;
  for (let i = 0; i < input.actualOddBestOfCount; i++)
    if (draw(0, 1, random) === 0) h++;
  return {
    heads: h,
    tails: input.actualOddBestOfCount - h,
    majority: h > input.actualOddBestOfCount / 2 ? "heads" : "tails",
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
  input: { seed: "batch51", actualOddBestOfCount: 3 },
  output: {
    result: {
      heads: 2,
      tails: 1,
      majority: "heads",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/coin-decider-best-of-n",
  title: "Coin Flip Best-of-N Decider",
  description:
    "FulloddNindependentfaircoin-majoritydecider,not earlystopfirst-to-majority or physicalfairness. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
