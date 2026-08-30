import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly auditedRecordCounts: readonly number[];
  readonly locationDiscrepancyCounts: readonly number[];
  readonly unlocatedRecordCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly confirmedDiscrepancyPercent: number;
  readonly possibleDiscrepancyUpperPercent: number;
  readonly unlocatedCoveragePercent: number;
}>;
const inputFields = [
  {
    id: "auditedRecordCounts",
    label: "Audited record counts",
    kind: "numberList",
  },
  {
    id: "locationDiscrepancyCounts",
    label: "Location discrepancy counts",
    kind: "numberList",
  },
  {
    id: "unlocatedRecordCounts",
    label: "Unlocated record counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.auditedRecordCounts.forEach((v) => count(v, "auditedRecordCounts"));
  input.locationDiscrepancyCounts.forEach((v) =>
    count(v, "locationDiscrepancyCounts"),
  );
  input.unlocatedRecordCounts.forEach((v) => count(v, "unlocatedRecordCounts"));
  aligned(
    input.auditedRecordCounts,
    input.locationDiscrepancyCounts,
    "auditedRecordCounts",
  );
  aligned(
    input.auditedRecordCounts,
    input.unlocatedRecordCounts,
    "auditedRecordCounts",
  );
  if (
    input.locationDiscrepancyCounts.some(
      (v, i) =>
        v + input.unlocatedRecordCounts[i] > input.auditedRecordCounts[i],
    )
  )
    simpleError(
      "records",
      "Confirmed discrepancy and unlocated counts must be disjoint subsets of audited records.",
    );
  const n = positive(
      totalCount(input.auditedRecordCounts, "audited"),
      "audited",
    ),
    d = totalCount(input.locationDiscrepancyCounts, "discrepancies"),
    u = totalCount(input.unlocatedRecordCounts, "unlocated");
  return {
    confirmedDiscrepancyPercent: (100 * d) / n,
    possibleDiscrepancyUpperPercent: (100 * (d + u)) / n,
    unlocatedCoveragePercent: (100 * u) / n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  auditedRecordCounts: [10, 30],
  locationDiscrepancyCounts: [1, 6],
  unlocatedRecordCounts: [2, 3],
} satisfies Input;
export const exampleOutput = {
  confirmedDiscrepancyPercent: 17.5,
  possibleDiscrepancyUpperPercent: 30,
  unlocatedCoveragePercent: 12.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/audit-discrepancy-rate-percent",
  title: "Location Audit Discrepancy Rate Percent Calculator",
  description:
    "Preserve confirmed versus unresolved location audit discrepancy bounds with actual pooled record denominators; unlocated items are not automatically compliant or stolen.",
  inputs: inputFields,
  outputs: [
    {
      id: "confirmedDiscrepancyPercent",
      label: "Confirmed discrepancy percent",
      kind: "number",
    },
    {
      id: "possibleDiscrepancyUpperPercent",
      label: "Possible discrepancy upper percent",
      kind: "number",
    },
    {
      id: "unlocatedCoveragePercent",
      label: "Unlocated coverage percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      auditedRecordCounts: value.auditedRecordCounts as readonly number[],
      locationDiscrepancyCounts:
        value.locationDiscrepancyCounts as readonly number[],
      unlocatedRecordCounts: value.unlocatedRecordCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
