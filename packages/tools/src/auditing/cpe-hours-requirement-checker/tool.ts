import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CpeRequirementInput = {
  readonly completedEthicsHours: number;
  readonly completedTotalHours: number;
  readonly requiredEthicsHours: number;
  readonly requiredTotalHours: number;
};

export type CpeRequirementOutput = {
  readonly ethicsComplete: boolean;
  readonly ethicsShortfallHours: number;
  readonly requirementMet: boolean;
  readonly totalShortfallHours: number;
};

export const evaluateCpeRequirement = (
  input: CpeRequirementInput,
): CpeRequirementOutput => {
  for (const [field, value] of [
    ["completedEthicsHours", input.completedEthicsHours],
    ["completedTotalHours", input.completedTotalHours],
    ["requiredEthicsHours", input.requiredEthicsHours],
    ["requiredTotalHours", input.requiredTotalHours],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_cpe_hours",
      );
  const totalShortfallHours = Math.max(
    0,
    input.requiredTotalHours - input.completedTotalHours,
  );
  const ethicsShortfallHours = Math.max(
    0,
    input.requiredEthicsHours - input.completedEthicsHours,
  );
  return {
    ethicsComplete: ethicsShortfallHours === 0,
    ethicsShortfallHours,
    requirementMet: totalShortfallHours === 0 && ethicsShortfallHours === 0,
    totalShortfallHours,
  };
};

export const cpeRequirementExample = {
  input: {
    completedEthicsHours: 4,
    completedTotalHours: 18,
    requiredEthicsHours: 4,
    requiredTotalHours: 20,
  },
  output: {
    ethicsComplete: true,
    ethicsShortfallHours: 0,
    requirementMet: false,
    totalShortfallHours: 2,
  },
} satisfies ToolExample<CpeRequirementInput, CpeRequirementOutput>;

export const cpeRequirementTool = createSimpleTool({
  calculate: (input) =>
    evaluateCpeRequirement({
      completedEthicsHours: input.completedEthicsHours as number,
      completedTotalHours: input.completedTotalHours as number,
      requiredEthicsHours: input.requiredEthicsHours as number,
      requiredTotalHours: input.requiredTotalHours as number,
    }),
  description:
    "Compare completed continuing-professional-education hours with caller-supplied total and subject-specific requirements. The tool deliberately does not label those inputs as GAGAS requirements because applicable periods and subject areas must come from the governing rule.",
  id: "auditing/cpe-hours-requirement-checker",
  inputs: [
    {
      id: "completedEthicsHours",
      kind: "number",
      label: "Completed ethics hours",
      minimum: 0,
    },
    {
      id: "completedTotalHours",
      kind: "number",
      label: "Completed total hours",
      minimum: 0,
    },
    {
      id: "requiredEthicsHours",
      kind: "number",
      label: "Required ethics hours",
      minimum: 0,
    },
    {
      id: "requiredTotalHours",
      kind: "number",
      label: "Required total hours",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "ethicsComplete", kind: "boolean", label: "Ethics hours complete" },
    {
      id: "ethicsShortfallHours",
      kind: "number",
      label: "Ethics shortfall",
      minimum: 0,
      unit: "hour",
    },
    { id: "requirementMet", kind: "boolean", label: "CPE requirement met" },
    {
      id: "totalShortfallHours",
      kind: "number",
      label: "Total shortfall",
      minimum: 0,
      unit: "hour",
    },
  ],
  title: "CPE Hours Requirement Checker",
});

export const runCpeRequirement = cpeRequirementTool.execute;
export default cpeRequirementTool;
