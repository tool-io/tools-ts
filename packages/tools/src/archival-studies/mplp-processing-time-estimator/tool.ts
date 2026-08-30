import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  safeCeil,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly unprocessedExtentsLinearFeetBySeries: readonly number[];
  readonly callerProcessingHoursPerFoot: readonly number[];
  readonly requiredFixedSeriesSetupHours: readonly number[];
  readonly availableProductiveHoursPerStaffDay: number;
}>;
export type Output = Readonly<{
  readonly modeledSeriesProcessingHours: readonly number[];
  readonly totalModeledProcessingHours: number;
  readonly wholeStaffDaysBudget: number;
}>;
const inputFields = [
  {
    id: "unprocessedExtentsLinearFeetBySeries",
    label: "Unprocessed extents linear feet by series",
    kind: "numberList",
  },
  {
    id: "callerProcessingHoursPerFoot",
    label: "Caller processing hours per foot",
    kind: "numberList",
  },
  {
    id: "requiredFixedSeriesSetupHours",
    label: "Required fixed series setup hours",
    kind: "numberList",
  },
  {
    id: "availableProductiveHoursPerStaffDay",
    label: "Available productive hours per staff day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.availableProductiveHoursPerStaffDay,
    "availableProductiveHoursPerStaffDay",
  );
  input.unprocessedExtentsLinearFeetBySeries.forEach((v) =>
    nonnegative(v, "unprocessedExtentsLinearFeetBySeries"),
  );
  input.callerProcessingHoursPerFoot.forEach((v) =>
    nonnegative(v, "callerProcessingHoursPerFoot"),
  );
  input.requiredFixedSeriesSetupHours.forEach((v) =>
    nonnegative(v, "requiredFixedSeriesSetupHours"),
  );
  aligned(
    input.unprocessedExtentsLinearFeetBySeries,
    input.callerProcessingHoursPerFoot,
    "unprocessedExtentsLinearFeetBySeries",
  );
  aligned(
    input.unprocessedExtentsLinearFeetBySeries,
    input.requiredFixedSeriesSetupHours,
    "unprocessedExtentsLinearFeetBySeries",
  );
  const h = input.unprocessedExtentsLinearFeetBySeries.map(
      (v, i) =>
        v * input.callerProcessingHoursPerFoot[i] +
        input.requiredFixedSeriesSetupHours[i],
    ),
    total = sum(h);
  return {
    modeledSeriesProcessingHours: h,
    totalModeledProcessingHours: total,
    wholeStaffDaysBudget: safeCeil(
      total / input.availableProductiveHoursPerStaffDay,
      "days",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unprocessedExtentsLinearFeetBySeries: [10, 20],
  callerProcessingHoursPerFoot: [1, 2],
  requiredFixedSeriesSetupHours: [2, 3],
  availableProductiveHoursPerStaffDay: 5,
} satisfies Input;
export const exampleOutput = {
  modeledSeriesProcessingHours: [12, 43],
  totalModeledProcessingHours: 55,
  wholeStaffDaysBudget: 11,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/mplp-processing-time-estimator",
  title: "Processing Time per Linear Foot Estimator (MPLP)",
  description:
    "Budget MPLP processing workload by measured series extents, caller complexity rates and explicit setup overhead; no universal hours-per-foot or description-quality guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledSeriesProcessingHours",
      label: "Modeled series processing hours",
      kind: "numberList",
    },
    {
      id: "totalModeledProcessingHours",
      label: "Total modeled processing hours",
      kind: "number",
    },
    {
      id: "wholeStaffDaysBudget",
      label: "Whole staff days budget",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      unprocessedExtentsLinearFeetBySeries:
        value.unprocessedExtentsLinearFeetBySeries as readonly number[],
      callerProcessingHoursPerFoot:
        value.callerProcessingHoursPerFoot as readonly number[],
      requiredFixedSeriesSetupHours:
        value.requiredFixedSeriesSetupHours as readonly number[],
      availableProductiveHoursPerStaffDay:
        value.availableProductiveHoursPerStaffDay as number,
    }),
});
export const run = tool.execute;
export default tool;
