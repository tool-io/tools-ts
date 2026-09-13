import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerCategoryLabels: readonly string[];
  readonly actualIndependentlyAnnotatedCategoryScores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCategoryLabels",
    label: "Caller category labels",
    kind: "stringList",
  },
  {
    id: "actualIndependentlyAnnotatedCategoryScores",
    label: "Actual independently annotated category scores",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(input.callerCategoryLabels, "categories");
  aligned(
    input.callerCategoryLabels,
    input.actualIndependentlyAnnotatedCategoryScores,
    "scores",
  );
  const m = Math.max(...input.actualIndependentlyAnnotatedCategoryScores);
  return {
    tiedToyCategories: input.callerCategoryLabels.filter(
      (_, i) => input.actualIndependentlyAnnotatedCategoryScores[i] === m,
    ),
    maximumToyScore: m,
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
    callerCategoryLabels: ["mocktail-a", "mocktail-b"],
    actualIndependentlyAnnotatedCategoryScores: [2, 2],
  },
  output: {
    result: {
      tiedToyCategories: ["mocktail-a", "mocktail-b"],
      maximumToyScore: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/cocktail-personality-match",
  title: "Cocktail Personality Match Fun",
  description:
    "Explicitcaller-defined Cocktail Personality Match Fun entertainmentcategory argmax,tiesretained,no published/licensedquiz scoringorreal personality/aura assessment. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
