import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualOneLengthSeconds: number;
  readonly actualIndependentlyCountedStrokes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOneLengthSeconds",
    label: "Actual one length seconds",
    kind: "number",
  },
  {
    id: "actualIndependentlyCountedStrokes",
    label: "Actual independently counted strokes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualOneLengthSeconds, "actualOneLengthSeconds");
  bounded(
    input.actualIndependentlyCountedStrokes,
    "actualIndependentlyCountedStrokes",
    0,
    1000000,
  );
  return {
    value:
      input.actualOneLengthSeconds + input.actualIndependentlyCountedStrokes,
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
  input: { actualOneLengthSeconds: 20, actualIndependentlyCountedStrokes: 15 },
  output: { result: { value: 35 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/swolf-swim-efficiency-score",
  title: "SWOLF Swim Efficiency Score",
  description:
    "SWOLFactualone-lengthseconds+stroke-count,distance/stylecountdefinitionexternal,nocompareunequal-lengthpools. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
