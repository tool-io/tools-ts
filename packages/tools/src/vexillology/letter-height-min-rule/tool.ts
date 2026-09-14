import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedLetterHeight: number;
  readonly callerIndependentRequiredLetterHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedLetterHeight",
    label: "Actual observed letter height",
    kind: "number",
  },
  {
    id: "callerIndependentRequiredLetterHeight",
    label: "Caller independent required letter height",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualObservedLetterHeight, "actual");
  positive(input.callerIndependentRequiredLetterHeight, "minimum");
  return {
    signedLetterHeightMargin:
      input.actualObservedLetterHeight -
      input.callerIndependentRequiredLetterHeight,
    meetsCallerMinimumHeight:
      input.actualObservedLetterHeight >=
      input.callerIndependentRequiredLetterHeight,
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
    actualObservedLetterHeight: 2,
    callerIndependentRequiredLetterHeight: 3,
  },
  output: {
    result: { signedLetterHeightMargin: -1, meetsCallerMinimumHeight: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/letter-height-min-rule",
  title: "Letter Height Minimum Rule Checker",
  description:
    "Actualletterheightvsindependently applicableminimum,signedmargin,not universalflaglettercodeor legibilitycertificate. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
