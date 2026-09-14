import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredDraft: number;
  readonly actualMeasuredTotalThickness: number;
  readonly callerActualIceDensity: number;
  readonly callerActualWaterDensity: number;
  readonly callerIndependentDraftTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMeasuredDraft", label: "Actual measured draft", kind: "number" },
  {
    id: "actualMeasuredTotalThickness",
    label: "Actual measured total thickness",
    kind: "number",
  },
  {
    id: "callerActualIceDensity",
    label: "Caller actual ice density",
    kind: "number",
  },
  {
    id: "callerActualWaterDensity",
    label: "Caller actual water density",
    kind: "number",
  },
  {
    id: "callerIndependentDraftTolerance",
    label: "Caller independent draft tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.callerActualIceDensity, "iceρ");
  positive(input.callerActualWaterDensity, "waterρ");
  nonnegative(input.actualMeasuredTotalThickness, "H");
  nonnegative(input.actualMeasuredDraft, "draft");
  nonnegative(input.callerIndependentDraftTolerance, "tolerance");
  if (
    input.callerActualIceDensity >= input.callerActualWaterDensity ||
    input.actualMeasuredDraft > input.actualMeasuredTotalThickness
  )
    simpleError("floating", "Declaredfloatingdensity/geometricaldraftbranch.");
  const e =
      (input.actualMeasuredTotalThickness * input.callerActualIceDensity) /
      input.callerActualWaterDensity,
    d = input.actualMeasuredDraft - e;
  return {
    hydrostaticExpectedDraft: e,
    signedDraftDiscrepancy: d,
    withinCallerDraftTolerance:
      Math.abs(d) <= input.callerIndependentDraftTolerance,
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
    actualMeasuredDraft: 4,
    actualMeasuredTotalThickness: 10,
    callerActualIceDensity: 500,
    callerActualWaterDensity: 1000,
    callerIndependentDraftTolerance: 0.1,
  },
  output: {
    result: {
      hydrostaticExpectedDraft: 5,
      signedDraftDiscrepancy: -1,
      withinCallerDraftTolerance: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/tabular-iceberg-draft-checker",
  title: "Tabular Iceberg Draft Checker",
  description:
    "Observedtabularicebergdraftversusidealuniformhydrostaticdensityexpectedvalue,signedmismatchnot stability/groundingdiagnosis. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
