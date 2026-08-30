import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly reportedNetNights: number;
  readonly assessedNights: number;
  readonly selfReportReliability: number;
}>;
export type Output = Readonly<{
  readonly reportedUseFraction: number;
  readonly adjustedUseFraction: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.reportedNetNights, "reportedNetNights");
  count(input.assessedNights, "assessedNights", 1);
  fraction(input.selfReportReliability, "selfReportReliability");
  if (input.reportedNetNights > input.assessedNights)
    simpleError(
      "reportedNetNights",
      "Reported nights cannot exceed assessed nights.",
    );
  const reportedUseFraction = input.reportedNetNights / input.assessedNights;
  return {
    reportedUseFraction,
    adjustedUseFraction: reportedUseFraction * input.selfReportReliability,
  };
};
export const exampleInput = {
  reportedNetNights: 6,
  assessedNights: 7,
  selfReportReliability: 0.8,
} satisfies Input;
export const exampleOutput = {
  reportedUseFraction: 0.8571428571428571,
  adjustedUseFraction: 0.6857142857142857,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/net-use-adherence",
  title: "Net Use Adherence",
  description:
    "Apply a caller-defined reliability factor to reported insecticide-treated-net use.",
  inputs: [
    { id: "reportedNetNights", label: "Reported net nights", kind: "integer" },
    { id: "assessedNights", label: "Assessed nights", kind: "integer" },
    {
      id: "selfReportReliability",
      label: "Self report reliability",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "reportedUseFraction",
      label: "Reported use fraction",
      kind: "number",
    },
    {
      id: "adjustedUseFraction",
      label: "Adjusted use fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      reportedNetNights: value.reportedNetNights as number,
      assessedNights: value.assessedNights as number,
      selfReportReliability: value.selfReportReliability as number,
    }),
});
export const run = tool.execute;
export default tool;
