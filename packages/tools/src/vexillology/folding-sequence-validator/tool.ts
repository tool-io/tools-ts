import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedTriFoldStepLabels: readonly string[];
  readonly callerIndependentQualifiedRequiredStepLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedTriFoldStepLabels",
    label: "Actual observed tri fold step labels",
    kind: "stringList",
  },
  {
    id: "callerIndependentQualifiedRequiredStepLabels",
    label: "Caller independent qualified required step labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.callerIndependentQualifiedRequiredStepLabels.length)
    simpleError("reference", "Actualindependentlyqualifiedprotocolsequence.");
  const n = Math.max(
      input.actualObservedTriFoldStepLabels.length,
      input.callerIndependentQualifiedRequiredStepLabels.length,
    ),
    i =
      Array.from({ length: n }, (_, i) => i).find(
        (i) =>
          input.actualObservedTriFoldStepLabels[i] !==
          input.callerIndependentQualifiedRequiredStepLabels[i],
      ) ?? -1;
  return { exactQualifiedSequenceMatch: i === -1, firstMismatchZeroBased: i };
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
    actualObservedTriFoldStepLabels: ["fold-first-third", "fold-second-third"],
    callerIndependentQualifiedRequiredStepLabels: [
      "fold-first-third",
      "fold-second-third",
    ],
  },
  output: {
    result: { exactQualifiedSequenceMatch: true, firstMismatchZeroBased: -1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/folding-sequence-validator",
  title: "Folding Sequence Validator (tri-fold)",
  description:
    "Actualtri-foldrecord versusINDEPENDENTrequiredsequencewithfirstmismatch,lengthsexact,not universalceremonialritual/clothgeometrycertification. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
