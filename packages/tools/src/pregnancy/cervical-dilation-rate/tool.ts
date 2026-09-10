import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  positive,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyAssessedPreviousDilationCm: number;
  readonly independentlyAssessedCurrentDilationCm: number;
  readonly elapsedExamHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAssessedPreviousDilationCm",
    label: "Independently assessed previous dilation cm",
    kind: "number",
  },
  {
    id: "independentlyAssessedCurrentDilationCm",
    label: "Independently assessed current dilation cm",
    kind: "number",
  },
  { id: "elapsedExamHours", label: "Elapsed exam hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlyAssessedPreviousDilationCm,
    input.independentlyAssessedCurrentDilationCm,
  ].forEach((v) => {
    if (v < 0 || v > 10)
      simpleError("dilation", "Explicit bounded clinical0–10cmobservations.");
  });
  positive(input.elapsedExamHours, "interval");
  return {
    signedObservedDilationCmPerHour:
      (input.independentlyAssessedCurrentDilationCm -
        input.independentlyAssessedPreviousDilationCm) /
      input.elapsedExamHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAssessedPreviousDilationCm: 3,
    independentlyAssessedCurrentDilationCm: 5,
    elapsedExamHours: 2,
  },
  output: { result: { signedObservedDilationCmPerHour: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/cervical-dilation-rate",
  title: "Cervical Dilation Rate Calculator",
  description:
    "Actual independently clinically assessed two-exam dilation change/time. Signed apparent regression retained as measurement discrepancy, not linear labour forecast, abnormal-progress threshold or intervention indication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
