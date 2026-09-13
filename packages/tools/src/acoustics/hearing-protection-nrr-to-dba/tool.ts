import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredUnprotectedDba: number;
  readonly callerIndependentlyApplicableNrrDb: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredUnprotectedDba",
    label: "Actual measured unprotected dba",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicableNrrDb",
    label: "Caller independently applicable nrr db",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentlyApplicableNrrDb,
    "callerIndependentlyApplicableNrrDb",
  );
  return {
    value:
      input.actualMeasuredUnprotectedDba -
      (input.callerIndependentlyApplicableNrrDb - 7),
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
    actualMeasuredUnprotectedDba: 100,
    callerIndependentlyApplicableNrrDb: 27,
  },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/hearing-protection-nrr-to-dba",
  title: "Hearing Protection NRR to dBA Calculator",
  description:
    "DeclaredUSscreen dBA\u2212(NRR\u22127),actualapplicableNRR/fitexternal,not guaranteedprotectedearlevelor authorize exposure. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
