import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly acuteLoad: number;
  readonly chronicLoad: number;
  readonly zoneLower: number;
  readonly zoneUpper: number;
}>;
export type Output = Readonly<{
  readonly workloadRatio: number;
  readonly withinZone: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.acuteLoad < 0 ||
    input.chronicLoad <= 0 ||
    input.zoneLower < 0 ||
    input.zoneUpper < input.zoneLower
  )
    simpleError(
      "chronicLoad",
      "Positive chronic load and ordered caller-defined ratio zone required.",
    );
  const workloadRatio = input.acuteLoad / input.chronicLoad;
  return {
    workloadRatio,
    withinZone:
      workloadRatio >= input.zoneLower && workloadRatio <= input.zoneUpper,
  };
};
export const exampleInput = {
  acuteLoad: 400,
  chronicLoad: 500,
  zoneLower: 0.8,
  zoneUpper: 1.3,
} satisfies Input;
export const exampleOutput = {
  workloadRatio: 0.8,
  withinZone: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/acute-chronic-workload-ratio",
  title: "Acute Chronic Workload Ratio",
  description:
    "Screen acute-to-chronic workload ratio using caller-supplied zone boundaries.",
  inputs: [
    { id: "acuteLoad", label: "Acute load", kind: "number" },
    { id: "chronicLoad", label: "Chronic load", kind: "number" },
    { id: "zoneLower", label: "Zone lower", kind: "number" },
    { id: "zoneUpper", label: "Zone upper", kind: "number" },
  ],
  outputs: [
    { id: "workloadRatio", label: "Workload ratio", kind: "number" },
    { id: "withinZone", label: "Within zone", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      acuteLoad: value.acuteLoad as number,
      chronicLoad: value.chronicLoad as number,
      zoneLower: value.zoneLower as number,
      zoneUpper: value.zoneUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
