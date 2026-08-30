import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnToOfficeTrajectoryInput = {
  readonly collaborationDependencyPercent: number;
  readonly locationFlexibleTaskPercent: number;
  readonly mandatoryOfficeDaysPerWeek: number;
};

export type ReturnToOfficeTrajectoryOutput = {
  readonly scenario: "hybrid" | "officeFirst" | "remoteFirst";
  readonly trajectoryRationale: string;
};

export const classifyReturnToOfficeTrajectory = (
  input: ReturnToOfficeTrajectoryInput,
): ReturnToOfficeTrajectoryOutput => {
  for (const [field, value] of [
    ["locationFlexibleTaskPercent", input.locationFlexibleTaskPercent],
    ["collaborationDependencyPercent", input.collaborationDependencyPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Task percentages must be finite values from 0 through 100.",
        "office_value_out_of_range",
      );
  if (
    !Number.isFinite(input.mandatoryOfficeDaysPerWeek) ||
    input.mandatoryOfficeDaysPerWeek < 0 ||
    input.mandatoryOfficeDaysPerWeek > 7
  )
    simpleError(
      "mandatoryOfficeDaysPerWeek",
      "Mandatory office days must be a value from 0 through 7.",
      "invalid_office_days",
    );
  if (
    input.collaborationDependencyPercent >= 70 &&
    input.mandatoryOfficeDaysPerWeek >= 3
  )
    return {
      scenario: "officeFirst",
      trajectoryRationale:
        "High collaboration dependence and substantial office mandates point toward an office-first trajectory.",
    };
  if (
    input.locationFlexibleTaskPercent >= 60 &&
    input.mandatoryOfficeDaysPerWeek <= 1
  )
    return {
      scenario: "remoteFirst",
      trajectoryRationale:
        "High task-location flexibility and low office mandates point toward a remote-first trajectory.",
    };
  return {
    scenario: "hybrid",
    trajectoryRationale:
      "Mixed task flexibility, collaboration dependence, or office mandates indicate a hybrid trajectory.",
  };
};

export const returnToOfficeTrajectoryExample = {
  input: {
    collaborationDependencyPercent: 60,
    locationFlexibleTaskPercent: 70,
    mandatoryOfficeDaysPerWeek: 2,
  },
  output: {
    scenario: "hybrid",
    trajectoryRationale:
      "Mixed task flexibility, collaboration dependence, or office mandates indicate a hybrid trajectory.",
  },
} satisfies ToolExample<
  ReturnToOfficeTrajectoryInput,
  ReturnToOfficeTrajectoryOutput
>;

export const returnToOfficeTrajectoryTool = createSimpleTool({
  calculate: (input) =>
    classifyReturnToOfficeTrajectory({
      collaborationDependencyPercent:
        input.collaborationDependencyPercent as number,
      locationFlexibleTaskPercent: input.locationFlexibleTaskPercent as number,
      mandatoryOfficeDaysPerWeek: input.mandatoryOfficeDaysPerWeek as number,
    }),
  description:
    "Classify an office trajectory from caller-supplied task flexibility, collaboration dependence, and office-day requirements.",
  id: "futurology/return-to-office-trajectory-scenarios-lookup",
  inputs: [
    {
      id: "collaborationDependencyPercent",
      kind: "number",
      label: "Collaboration dependence percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "locationFlexibleTaskPercent",
      kind: "number",
      label: "Location-flexible task percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "mandatoryOfficeDaysPerWeek",
      kind: "number",
      label: "Mandatory office days per week",
      maximum: 7,
      minimum: 0,
    },
  ],
  outputs: [
    {
      enum: ["remoteFirst", "hybrid", "officeFirst"],
      id: "scenario",
      kind: "string",
      label: "Office trajectory",
    },
    {
      id: "trajectoryRationale",
      kind: "string",
      label: "Trajectory rationale",
    },
  ],
  title: "Return to Office Trajectory Scenarios Lookup",
});

export const runReturnToOfficeTrajectory = returnToOfficeTrajectoryTool.execute;
export default returnToOfficeTrajectoryTool;
