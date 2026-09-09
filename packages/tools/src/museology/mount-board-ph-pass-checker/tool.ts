import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredBoardPh: number;
  readonly callerApplicableMinimumPh: number;
  readonly callerApplicableMaximumPh: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredBoardPh",
    label: "Independently measured board ph",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumPh",
    label: "Caller applicable minimum ph",
    kind: "number",
  },
  {
    id: "callerApplicableMaximumPh",
    label: "Caller applicable maximum ph",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    [
      input.independentlyMeasuredBoardPh,
      input.callerApplicableMinimumPh,
      input.callerApplicableMaximumPh,
    ].some((v) => v < 0 || v > 14) ||
    input.callerApplicableMaximumPh < input.callerApplicableMinimumPh
  )
    simpleError("pH", "Ordered restricted0–14pHwindow.");
  return {
    withinCallerPhScreen:
      input.independentlyMeasuredBoardPh >= input.callerApplicableMinimumPh &&
      input.independentlyMeasuredBoardPh <= input.callerApplicableMaximumPh,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredBoardPh: 7,
    callerApplicableMinimumPh: 6.5,
    callerApplicableMaximumPh: 8.5,
  },
  output: { result: { withinCallerPhScreen: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/mount-board-ph-pass-checker",
  title: "Acid-Free Mount Board pH Pass Checker",
  description:
    "Matched board-pHwindow screen only; measurement method and material policy independently verified. pHdoes not certify acid-free/lignin-free/PAT pass, buffering suitability or long-term preservation.",
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
