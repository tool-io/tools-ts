import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetentionDetachHoursTriggerCheckerInput = {
  readonly hoursAtFacility: number;
  readonly freeTimeHoursBeforeDetention?: number;
};

export type DetentionDetachHoursTriggerCheckerOutput = {
  readonly detentionBillableHours: number;
  readonly detentionTriggered: boolean;
};

export const calculateDetentionDetachHoursTriggerChecker = (
  input: DetentionDetachHoursTriggerCheckerInput,
): DetentionDetachHoursTriggerCheckerOutput => {
  const freeTimeHoursBeforeDetention = input.freeTimeHoursBeforeDetention ?? 2;
  if (!Number.isFinite(input.hoursAtFacility) || input.hoursAtFacility < 0)
    return simpleError(
      "hoursAtFacility",
      "Facility time must be finite and non-negative.",
      "invalid_hours",
    );
  if (
    !Number.isFinite(freeTimeHoursBeforeDetention) ||
    freeTimeHoursBeforeDetention < 0
  )
    return simpleError(
      "freeTimeHoursBeforeDetention",
      "Free time before detention must be finite and non-negative.",
      "invalid_hours",
    );
  return {
    detentionBillableHours: Math.max(
      0,
      input.hoursAtFacility - freeTimeHoursBeforeDetention,
    ),
    detentionTriggered: input.hoursAtFacility > freeTimeHoursBeforeDetention,
  };
};

export const detentionDetachHoursTriggerCheckerExample = {
  input: { hoursAtFacility: 3.25, freeTimeHoursBeforeDetention: 2 },
  output: { detentionBillableHours: 1.25, detentionTriggered: true },
} satisfies ToolExample<
  DetentionDetachHoursTriggerCheckerInput,
  DetentionDetachHoursTriggerCheckerOutput
>;

export const detentionDetachHoursTriggerCheckerTool = createSimpleTool({
  id: "logistics/detention-detach-hours-trigger-checker",
  title: "Detention Detach Hours Trigger Checker",
  description:
    "Check driver wait hours at a facility against the free time allowance to see whether detention billing triggers.",
  inputs: [
    {
      description: "Hours the driver waited at the facility.",
      id: "hoursAtFacility",
      kind: "number",
      label: "Hours at facility",
      minimum: 0,
      unit: "h",
    },
    {
      default: 2,
      description:
        "Contractual free hours allowed before detention starts; zero means billing starts immediately.",
      id: "freeTimeHoursBeforeDetention",
      kind: "number",
      label: "Free time",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Whether detention billing is triggered.",
      id: "detentionTriggered",
      kind: "boolean",
      label: "Detention triggered",
    },
    {
      description: "Billable detention hours beyond the free time.",
      id: "detentionBillableHours",
      kind: "number",
      label: "Billable hours",
      minimum: 0,
      unit: "h",
    },
  ],
  calculate: (input) =>
    calculateDetentionDetachHoursTriggerChecker({
      freeTimeHoursBeforeDetention: input.freeTimeHoursBeforeDetention as
        number | undefined,
      hoursAtFacility: input.hoursAtFacility as number,
    }),
});

export const runDetentionDetachHoursTriggerChecker =
  detentionDetachHoursTriggerCheckerTool.execute;
export default detentionDetachHoursTriggerCheckerTool;
