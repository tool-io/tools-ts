import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalCompensation: number;
  readonly jurisdictionDutyDays: number;
  readonly totalDutyDays: number;
}>;
export type Output = Readonly<{
  readonly allocationPercent: number;
  readonly allocatedCompensation: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.jurisdictionDutyDays > input.totalDutyDays)
    simpleError(
      "jurisdictionDutyDays",
      "Jurisdiction days cannot exceed total duty days.",
      "invalid_days",
    );
  const allocationPercent =
    (input.jurisdictionDutyDays / input.totalDutyDays) * 100;
  return {
    allocationPercent,
    allocatedCompensation:
      (input.totalCompensation * input.jurisdictionDutyDays) /
      input.totalDutyDays,
  };
};

export const exampleInput = {
  totalCompensation: 200000,
  jurisdictionDutyDays: 20,
  totalDutyDays: 100,
} satisfies Input;
export const exampleOutput = {
  allocationPercent: 20,
  allocatedCompensation: 40000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalCompensation: input.totalCompensation as number,
      jurisdictionDutyDays: input.jurisdictionDutyDays as number,
      totalDutyDays: input.totalDutyDays as number,
    }),
  description:
    "Allocate compensation by caller-supplied jurisdiction and total duty days.",
  id: "taxation/duty-day-income-allocation",
  inputs: [
    {
      id: "totalCompensation",
      label: "Total compensation",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "jurisdictionDutyDays",
      label: "Jurisdiction duty days",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalDutyDays",
      label: "Total duty days",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "allocationPercent",
      label: "Duty-day allocation",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "allocatedCompensation",
      label: "Allocated compensation",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Duty-Day Income Allocation",
});

export const run = tool.execute;
export default tool;
