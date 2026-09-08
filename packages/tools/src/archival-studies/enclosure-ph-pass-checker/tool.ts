import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredEnclosurePh: number;
  readonly callerApplicableLowerPh: number;
  readonly callerApplicableUpperPh: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredEnclosurePh",
    label: "Independently measured enclosure ph",
    kind: "number",
  },
  {
    id: "callerApplicableLowerPh",
    label: "Caller applicable lower ph",
    kind: "number",
  },
  {
    id: "callerApplicableUpperPh",
    label: "Caller applicable upper ph",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    [
      input.independentlyMeasuredEnclosurePh,
      input.callerApplicableLowerPh,
      input.callerApplicableUpperPh,
    ].some((v) => v < 0 || v > 14) ||
    input.callerApplicableUpperPh < input.callerApplicableLowerPh
  )
    simpleError("pH", "Ordered restricted0–14pHwindow.");
  return {
    withinCallerEnclosurePhWindow:
      input.independentlyMeasuredEnclosurePh >= input.callerApplicableLowerPh &&
      input.independentlyMeasuredEnclosurePh <= input.callerApplicableUpperPh,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredEnclosurePh: 7,
    callerApplicableLowerPh: 6.5,
    callerApplicableUpperPh: 8.5,
  },
  output: { result: { withinCallerEnclosurePhWindow: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/enclosure-ph-pass-checker",
  title: "Enclosure Folder Acid-Free pH Pass Checker",
  description:
    "Actual folder/enclosure pHscreen under independently verified material policy/test method. pHalone does not prove acid-free, lignin-free, buffering suitability, PAT pass or long-term preservation.",
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
