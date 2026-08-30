import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MajorProgramStepsInput = {
  readonly overallThreshold: number;
  readonly programExpenditure: number;
  readonly programThreshold: number;
  readonly totalFederalExpenditure: number;
};

export type MajorProgramStepsOutput = {
  readonly overallThresholdMet: boolean;
  readonly programThresholdMet: boolean;
  readonly programSharePercent: number;
};

export const determineMajorProgramSteps = (
  input: MajorProgramStepsInput,
): MajorProgramStepsOutput => {
  for (const [field, value] of [
    ["overallThreshold", input.overallThreshold],
    ["programExpenditure", input.programExpenditure],
    ["programThreshold", input.programThreshold],
    ["totalFederalExpenditure", input.totalFederalExpenditure],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_expenditure_value",
      );
  if (input.totalFederalExpenditure === 0)
    simpleError(
      "totalFederalExpenditure",
      "Total federal expenditure must be greater than zero.",
      "zero_total_expenditure",
    );
  const overallThresholdMet =
    input.totalFederalExpenditure >= input.overallThreshold;
  const programSharePercent =
    (input.programExpenditure / input.totalFederalExpenditure) * 100;
  if (!Number.isFinite(programSharePercent))
    simpleError(
      "programExpenditure",
      "Program share is not finite.",
      "result_not_finite",
    );
  return {
    overallThresholdMet,
    programThresholdMet:
      overallThresholdMet && input.programExpenditure >= input.programThreshold,
    programSharePercent,
  };
};

export const majorProgramStepsExample = {
  input: {
    overallThreshold: 750_000,
    programExpenditure: 300_000,
    programThreshold: 300_000,
    totalFederalExpenditure: 1_000_000,
  },
  output: {
    overallThresholdMet: true,
    programThresholdMet: true,
    programSharePercent: 30,
  },
} satisfies ToolExample<MajorProgramStepsInput, MajorProgramStepsOutput>;

export const majorProgramStepsTool = createSimpleTool({
  calculate: (input) =>
    determineMajorProgramSteps({
      overallThreshold: input.overallThreshold as number,
      programExpenditure: input.programExpenditure as number,
      programThreshold: input.programThreshold as number,
      totalFederalExpenditure: input.totalFederalExpenditure as number,
    }),
  description:
    "Apply caller-supplied overall and program expenditure thresholds in sequence and return the program share and screening result. This arithmetic screen does not by itself determine whether a program is a major program under Uniform Guidance.",
  id: "auditing/program-expenditure-threshold-screen",
  inputs: [
    {
      id: "overallThreshold",
      kind: "number",
      label: "Overall threshold",
      minimum: 0,
    },
    {
      id: "programExpenditure",
      kind: "number",
      label: "Program expenditure",
      minimum: 0,
    },
    {
      id: "programThreshold",
      kind: "number",
      label: "Program threshold",
      minimum: 0,
    },
    {
      id: "totalFederalExpenditure",
      kind: "number",
      label: "Total federal expenditure",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overallThresholdMet",
      kind: "boolean",
      label: "Overall threshold met",
    },
    {
      id: "programThresholdMet",
      kind: "boolean",
      label: "Program threshold met",
    },
    {
      id: "programSharePercent",
      kind: "number",
      label: "Program share",
      minimum: 0,
      unit: "percent",
    },
  ],
  title: "Program Expenditure Threshold Screen",
});

export const runMajorProgramSteps = majorProgramStepsTool.execute;
export default majorProgramStepsTool;
