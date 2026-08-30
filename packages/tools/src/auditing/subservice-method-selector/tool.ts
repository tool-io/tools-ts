import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly subserviceControlsMaterial: boolean;
  readonly directEvidenceAvailable: boolean;
  readonly separateReportAvailable: boolean;
  readonly userCanMonitorSubservice: boolean;
}>;
export type Output = Readonly<{
  readonly recommendedMethod: string;
  readonly supportingFactorCount: number;
}>;

export const calculate = (input: Input): Output => {
  const supportingFactorCount = [
    input.directEvidenceAvailable,
    input.separateReportAvailable,
    input.userCanMonitorSubservice,
  ].filter(Boolean).length;
  const recommendedMethod = !input.subserviceControlsMaterial
    ? "carve-out"
    : input.directEvidenceAvailable
      ? "inclusive"
      : input.separateReportAvailable
        ? "separate-report"
        : input.userCanMonitorSubservice
          ? "carve-out"
          : "review";
  return { recommendedMethod, supportingFactorCount };
};

export const exampleInput = {
  subserviceControlsMaterial: true,
  directEvidenceAvailable: false,
  separateReportAvailable: true,
  userCanMonitorSubservice: false,
} satisfies Input;
export const exampleOutput = {
  recommendedMethod: "separate-report",
  supportingFactorCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      subserviceControlsMaterial: input.subserviceControlsMaterial as boolean,
      directEvidenceAvailable: input.directEvidenceAvailable as boolean,
      separateReportAvailable: input.separateReportAvailable as boolean,
      userCanMonitorSubservice: input.userCanMonitorSubservice as boolean,
    }),
  description:
    "Select a subservice-organization reporting method from supplied evidence facts.",
  id: "auditing/subservice-method-selector",
  inputs: [
    {
      id: "subserviceControlsMaterial",
      label: "Subservice controls are material",
      kind: "boolean",
    },
    {
      id: "directEvidenceAvailable",
      label: "Direct subservice evidence available",
      kind: "boolean",
    },
    {
      id: "separateReportAvailable",
      label: "Separate subservice report available",
      kind: "boolean",
    },
    {
      id: "userCanMonitorSubservice",
      label: "User entity can monitor subservice",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "recommendedMethod",
      label: "Recommended subservice method",
      kind: "string",
      enum: ["carve-out", "inclusive", "separate-report", "review"],
    },
    {
      id: "supportingFactorCount",
      label: "Supporting factor count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Subservice Method Selector",
});

export const run = tool.execute;
export default tool;
