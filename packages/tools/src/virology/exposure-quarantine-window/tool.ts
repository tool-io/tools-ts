import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly lastExposureDay: number;
  readonly incubationQuantileDays: number;
  readonly bufferDays: number;
  readonly evaluationDay: number;
}>;
export type Output = Readonly<{
  readonly policyEndDay: number;
  readonly remainingDays: number;
  readonly policyWindowElapsed: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.lastExposureDay, "lastExposureDay");
  nonnegative(input.incubationQuantileDays, "incubationQuantileDays");
  nonnegative(input.bufferDays, "bufferDays");
  nonnegative(input.evaluationDay, "evaluationDay");
  const policyEndDay =
    input.lastExposureDay + input.incubationQuantileDays + input.bufferDays;
  return {
    policyEndDay,
    remainingDays: Math.max(0, policyEndDay - input.evaluationDay),
    policyWindowElapsed: input.evaluationDay >= policyEndDay,
  };
};
export const exampleInput = {
  lastExposureDay: 3,
  incubationQuantileDays: 10,
  bufferDays: 2,
  evaluationDay: 14,
} satisfies Input;
export const exampleOutput = {
  policyEndDay: 15,
  remainingDays: 1,
  policyWindowElapsed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/exposure-quarantine-window",
  title: "Exposure Quarantine Window",
  description:
    "Apply a caller-defined incubation-quantile and buffer rule to the latest exposure day; policy values are not embedded.",
  inputs: [
    {
      id: "lastExposureDay",
      label: "Last exposure day",
      kind: "number",
      minimum: 0,
    },
    {
      id: "incubationQuantileDays",
      label: "Incubation quantile days",
      kind: "number",
      minimum: 0,
    },
    { id: "bufferDays", label: "Buffer days", kind: "number", minimum: 0 },
    {
      id: "evaluationDay",
      label: "Evaluation day",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "policyEndDay", label: "Policy end day", kind: "number" },
    { id: "remainingDays", label: "Remaining days", kind: "number" },
    {
      id: "policyWindowElapsed",
      label: "Policy window elapsed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      lastExposureDay: value.lastExposureDay as number,
      incubationQuantileDays: value.incubationQuantileDays as number,
      bufferDays: value.bufferDays as number,
      evaluationDay: value.evaluationDay as number,
    }),
});
export const run = tool.execute;
export default tool;
