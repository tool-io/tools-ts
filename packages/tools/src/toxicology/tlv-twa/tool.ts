import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredConcentrationsByInterval: readonly number[];
  readonly actualObservedIntervalHours: readonly number[];
  readonly callerApplicableReferenceShiftHours: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredConcentrationsByInterval",
    label: "Actual measured concentrations by interval",
    kind: "numberList",
  },
  {
    id: "actualObservedIntervalHours",
    label: "Actual observed interval hours",
    kind: "numberList",
  },
  {
    id: "callerApplicableReferenceShiftHours",
    label: "Caller applicable reference shift hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualMeasuredConcentrationsByInterval,
    input.actualObservedIntervalHours,
    "intervals",
  );
  input.actualMeasuredConcentrationsByInterval.forEach((v) =>
    nonnegative(v, "concentration"),
  );
  input.actualObservedIntervalHours.forEach((v) => positive(v, "hours"));
  positive(input.callerApplicableReferenceShiftHours, "reference-shift");
  const h = sum(input.actualObservedIntervalHours);
  if (h > input.callerApplicableReferenceShiftHours)
    simpleError(
      "inventory",
      "Actual disjoint sampled hours within reference shift.",
    );
  const t = sum(
    input.actualMeasuredConcentrationsByInterval.map(
      (v, i) => v * input.actualObservedIntervalHours[i],
    ),
  );
  return {
    observedSampledExposureConcentrationHours: t,
    conditionalReferenceShiftAverageFromObservedInventory:
      t / input.callerApplicableReferenceShiftHours,
    unobservedReferenceShiftHours:
      input.callerApplicableReferenceShiftHours - h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredConcentrationsByInterval: [2, 4],
    actualObservedIntervalHours: [1, 3],
    callerApplicableReferenceShiftHours: 8,
  },
  output: {
    result: {
      observedSampledExposureConcentrationHours: 14,
      conditionalReferenceShiftAverageFromObservedInventory: 1.75,
      unobservedReferenceShiftHours: 4,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/tlv-twa",
  title: "TLV TWA Calculator",
  description:
    "Actual ACGIHedition-specific TLV shift-reference exposure inventory concentration\u00d7 hours/divided by independently applicable reference-shift hours. Unobserved hours retained, not assumed safe/zero concentration or a complete complianceTWA. Units/substance/jurisdiction and sampling applicability external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
