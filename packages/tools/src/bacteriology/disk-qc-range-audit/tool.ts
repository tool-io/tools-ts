import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly qcRecordIds: readonly string[];
  readonly zoneDiametersMm: readonly number[];
  readonly minimumZonesMm: readonly number[];
  readonly maximumZonesMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly withinRangeFlags: readonly number[];
  readonly deviationsMm: readonly number[];
  readonly outOfRangeRecords: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.qcRecordIds, input.zoneDiametersMm, "qcRecordIds");
  aligned(input.qcRecordIds, input.minimumZonesMm, "qcRecordIds");
  aligned(input.qcRecordIds, input.maximumZonesMm, "qcRecordIds");
  if (new Set(input.qcRecordIds).size !== input.qcRecordIds.length)
    simpleError("qcRecordIds", "Distinct QC records required.");
  input.zoneDiametersMm.forEach((v) => nonnegative(v, "zoneDiametersMm"));
  input.minimumZonesMm.forEach((v, i) => {
    nonnegative(v, "minimumZonesMm");
    if (input.maximumZonesMm[i] < v)
      simpleError(
        "maximumZonesMm",
        "Ordered nonnegative strain/drug/method-specific QC limits required.",
      );
  });
  const deviationsMm = input.zoneDiametersMm.map((v, i) =>
      v < input.minimumZonesMm[i]
        ? v - input.minimumZonesMm[i]
        : v > input.maximumZonesMm[i]
          ? v - input.maximumZonesMm[i]
          : 0,
    ),
    withinRangeFlags = deviationsMm.map((v) => Number(v === 0));
  return {
    withinRangeFlags,
    deviationsMm,
    outOfRangeRecords: input.qcRecordIds.filter(
      (_, i) => withinRangeFlags[i] === 0,
    ),
  };
};
export const exampleInput = {
  qcRecordIds: ["A", "B"],
  zoneDiametersMm: [20, 30],
  minimumZonesMm: [18, 20],
  maximumZonesMm: [22, 28],
} satisfies Input;
export const exampleOutput = {
  withinRangeFlags: [1, 0],
  deviationsMm: [0, 2],
  outOfRangeRecords: ["B"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/disk-qc-range-audit",
  title: "Disk QC Range Audit",
  description:
    "Audit observed QC disk zones against supplied strain-, drug-, and method-specific inclusive ranges.",
  inputs: [
    { id: "qcRecordIds", label: "Qc record ids", kind: "stringList" },
    { id: "zoneDiametersMm", label: "Zone diameters mm", kind: "numberList" },
    { id: "minimumZonesMm", label: "Minimum zones mm", kind: "numberList" },
    { id: "maximumZonesMm", label: "Maximum zones mm", kind: "numberList" },
  ],
  outputs: [
    { id: "withinRangeFlags", label: "Within range flags", kind: "numberList" },
    { id: "deviationsMm", label: "Deviations mm", kind: "numberList" },
    {
      id: "outOfRangeRecords",
      label: "Out of range records",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      qcRecordIds: value.qcRecordIds as readonly string[],
      zoneDiametersMm: value.zoneDiametersMm as readonly number[],
      minimumZonesMm: value.minimumZonesMm as readonly number[],
      maximumZonesMm: value.maximumZonesMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
