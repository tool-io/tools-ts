import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyRecordedFoldStepLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyRecordedFoldStepLabels",
    label: "Actual independently recorded fold step labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    !input.actualIndependentlyRecordedFoldStepLabels.length ||
    input.actualIndependentlyRecordedFoldStepLabels.some(
      (v) => !["lengthfold", "trianglefold", "turn", "tuck"].includes(v),
    )
  )
    simpleError("steps", "Actualboundedobservedfoldstep vocabulary.");
  return {
    observedFoldStepCount:
      input.actualIndependentlyRecordedFoldStepLabels.length,
    observedTriangleFoldCount:
      input.actualIndependentlyRecordedFoldStepLabels.filter(
        (v) => v === "trianglefold",
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
    actualIndependentlyRecordedFoldStepLabels: [
      "lengthfold",
      "trianglefold",
      "trianglefold",
    ],
  },
  output: {
    result: { observedFoldStepCount: 3, observedTriangleFoldCount: 2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/ceremonial-fold-steps",
  title: "Ceremonial Fold Step Counter",
  description:
    "Actualobservedstepcountusingexplicitlengthfold/trianglefold/turn/tuckevents,not universal13foldritual/geometrictriangleconstruction. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
