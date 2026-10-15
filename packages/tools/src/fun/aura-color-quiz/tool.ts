import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerCategoryLabels: readonly string[];
  readonly actualIndependentlyAnnotatedCategoryScores: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
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
const compute = (input: Input, context?: ToolExecutionContext) => {
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
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerCategoryLabels: ["blue", "green"],
    actualIndependentlyAnnotatedCategoryScores: [2, 2],
  },
  output: {
    result: { tiedToyCategories: ["blue", "green"], maximumToyScore: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/aura-color-quiz",
  title: "Aura Color Quiz Logic",
  description:
    "Explicitcaller-defined Aura Color Quiz Logic entertainmentcategory argmax,tiesretained,no published/licensedquiz scoringorreal personality/aura assessment. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
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
          tiedToyCategories: { type: "array", items: { type: "string" } },
          maximumToyScore: { type: "number" },
        },
        required: ["tiedToyCategories", "maximumToyScore"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
