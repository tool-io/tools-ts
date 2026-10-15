import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualSignatureStrokeCount: number;
  readonly actualIndependentlyClassifiedDecorativeStrokeCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSignatureStrokeCount",
    label: "Actual signature stroke count",
    kind: "number",
  },
  {
    id: "actualIndependentlyClassifiedDecorativeStrokeCount",
    label: "Actual independently classified decorative stroke count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualSignatureStrokeCount, "strokes", 1, 10000);
  bounded(
    input.actualIndependentlyClassifiedDecorativeStrokeCount,
    "decorative",
    0,
    input.actualSignatureStrokeCount,
  );
  return {
    observedDecorativeStrokeFraction:
      input.actualIndependentlyClassifiedDecorativeStrokeCount /
      input.actualSignatureStrokeCount,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualSignatureStrokeCount: 10,
    actualIndependentlyClassifiedDecorativeStrokeCount: 2,
  },
  output: { result: { observedDecorativeStrokeFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/signature-style-rater",
  title: "Signature Style Rater Fun",
  description:
    "Declaredobserveddecorativestroke-stylefraction,not personality,authenticity,legibility or handwritingforensicidentification. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedDecorativeStrokeFraction: { type: "number" } },
        required: ["observedDecorativeStrokeFraction"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
