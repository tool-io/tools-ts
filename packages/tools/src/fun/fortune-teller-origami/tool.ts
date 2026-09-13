import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  sourceFor,
  draw,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly callerActualOrigamiChoices: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "callerActualOrigamiChoices",
    label: "Caller actual origami choices",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  unique(input.callerActualOrigamiChoices, "choices");
  return {
    selectedDecision:
      input.callerActualOrigamiChoices[
        draw(0, input.callerActualOrigamiChoices.length - 1, random)
      ],
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
  input: {
    seed: "batch51",
    callerActualOrigamiChoices: ["walk", "read", "draw", "bake"],
  },
  output: {
    result: {
      selectedDecision: "read",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/fortune-teller-origami",
  title: "Fortune Teller Origami Decision Maker",
  description:
    "Uniformcallerorigamidecisioncardchoice,no numerological/deterministicfortuneor personaldecisionadvice. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
