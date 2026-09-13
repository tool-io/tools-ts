import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualChosenToppings: readonly string[];
  readonly callerForbiddenPairFirst: readonly string[];
  readonly callerForbiddenPairSecond: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualChosenToppings",
    label: "Actual chosen toppings",
    kind: "stringList",
  },
  {
    id: "callerForbiddenPairFirst",
    label: "Caller forbidden pair first",
    kind: "stringList",
  },
  {
    id: "callerForbiddenPairSecond",
    label: "Caller forbidden pair second",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(input.actualChosenToppings, "toppings");
  aligned(
    input.callerForbiddenPairFirst,
    input.callerForbiddenPairSecond,
    "pairs",
  );
  return {
    observedForbiddenPairCount: input.callerForbiddenPairFirst.filter(
      (v, i) =>
        input.actualChosenToppings.includes(v) &&
        input.actualChosenToppings.includes(input.callerForbiddenPairSecond[i]),
    ).length,
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
    actualChosenToppings: ["tomato", "basil"],
    callerForbiddenPairFirst: ["tomato"],
    callerForbiddenPairSecond: ["pineapple"],
  },
  output: { result: { observedForbiddenPairCount: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/pizza-topping-matcher",
  title: "Pizza Topping Compatibility Matcher",
  description:
    "Actualchosenpizza-toppinglabels versus independentlychosen forbiddenpairpreferences,allliteralcase-sensitive,not tasteprediction,foodallergyassessmentor foodsafety.",
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
