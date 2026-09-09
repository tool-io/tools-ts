import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedDisplayControlHeightMm: number;
  readonly callerApplicableMinimumReachMm: number;
  readonly callerApplicableMaximumReachMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDisplayControlHeightMm",
    label: "Observed display control height mm",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumReachMm",
    label: "Caller applicable minimum reach mm",
    kind: "number",
  },
  {
    id: "callerApplicableMaximumReachMm",
    label: "Caller applicable maximum reach mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedDisplayControlHeightMm, "height");
  nonnegative(input.callerApplicableMinimumReachMm, "minimum");
  if (
    input.callerApplicableMaximumReachMm < input.callerApplicableMinimumReachMm
  )
    simpleError("window", "Ordered caller reach window.");
  return {
    withinCallerVerticalReachWindow:
      input.observedDisplayControlHeightMm >=
        input.callerApplicableMinimumReachMm &&
      input.observedDisplayControlHeightMm <=
        input.callerApplicableMaximumReachMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedDisplayControlHeightMm: 1000,
    callerApplicableMinimumReachMm: 400,
    callerApplicableMaximumReachMm: 1200,
  },
  output: { result: { withinCallerVerticalReachWindow: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/wheelchair-reach-height-checker",
  title: "Wheelchair Reach Display Height Compliance Checker",
  description:
    "Actual vertical-height window screen under independently applicable policy. Lateral reach, obstructions, floor space, users and local accessibility law remain external; not wheelchair accessibility/compliance certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
