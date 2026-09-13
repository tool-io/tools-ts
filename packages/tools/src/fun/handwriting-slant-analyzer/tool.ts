import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredStrokeSlantDegrees: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyMeasuredStrokeSlantDegrees",
    label: "Actual independently measured stroke slant degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    !input.actualIndependentlyMeasuredStrokeSlantDegrees.length ||
    input.actualIndependentlyMeasuredStrokeSlantDegrees.some(
      (v) => Math.abs(v) > 90,
    )
  )
    simpleError("angles", "Actualresolvedstrokeswithin±90°.");
  return {
    meanObservedSlantDegrees: mean(
      input.actualIndependentlyMeasuredStrokeSlantDegrees,
    ),
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
  input: { actualIndependentlyMeasuredStrokeSlantDegrees: [-2, 0, 2] },
  output: { result: { meanObservedSlantDegrees: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/handwriting-slant-analyzer",
  title: "Handwriting Personality Slant Analyzer Fun",
  description:
    "ObservedmeanhandwritingstrokeslantONLY,doesnot inferpersonality/emotion/identityfrom handwriting. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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
