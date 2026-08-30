import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurpriseCashCountInput = {
  readonly countObservations: number;
  readonly countTeamIndependent: boolean;
  readonly locationSelectedByAuditor: boolean;
  readonly performedOnScheduledDate: boolean;
  readonly wasAnnounced: boolean;
};

export type SurpriseCashCountOutput = {
  readonly observationCountValid: boolean;
  readonly validSurpriseCount: boolean;
  readonly violationCount: number;
  readonly violations: ReadonlyArray<string>;
};

export const checkSurpriseCashCount = (
  input: SurpriseCashCountInput,
): SurpriseCashCountOutput => {
  for (const field of [
    "countTeamIndependent",
    "locationSelectedByAuditor",
    "performedOnScheduledDate",
    "wasAnnounced",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (
    !Number.isSafeInteger(input.countObservations) ||
    input.countObservations < 1
  )
    simpleError(
      "countObservations",
      "Observation count must be a positive whole number.",
      "invalid_observation_count",
    );
  const violations: string[] = [];
  if (input.wasAnnounced) violations.push("count_was_announced");
  if (input.performedOnScheduledDate)
    violations.push("count_used_scheduled_date");
  if (!input.locationSelectedByAuditor)
    violations.push("location_not_selected_by_auditor");
  if (!input.countTeamIndependent)
    violations.push("count_team_not_independent");
  return {
    observationCountValid: input.countObservations > 0,
    validSurpriseCount: violations.length === 0,
    violationCount: violations.length,
    violations,
  };
};

export const surpriseCashCountExample = {
  input: {
    countObservations: 2,
    countTeamIndependent: true,
    locationSelectedByAuditor: true,
    performedOnScheduledDate: true,
    wasAnnounced: false,
  },
  output: {
    observationCountValid: true,
    validSurpriseCount: false,
    violationCount: 1,
    violations: ["count_used_scheduled_date"],
  },
} satisfies ToolExample<SurpriseCashCountInput, SurpriseCashCountOutput>;

export const surpriseCashCountTool = createSimpleTool({
  calculate: (input) =>
    checkSurpriseCashCount({
      countObservations: input.countObservations as number,
      countTeamIndependent: input.countTeamIndependent as boolean,
      locationSelectedByAuditor: input.locationSelectedByAuditor as boolean,
      performedOnScheduledDate: input.performedOnScheduledDate as boolean,
      wasAnnounced: input.wasAnnounced as boolean,
    }),
  description:
    "Check supplied surprise-cash-count facts for announcement, scheduling, auditor-selected location, team independence, and observation count.",
  id: "auditing/surprise-cash-count-unannounced-rotation-checker",
  inputs: [
    {
      description: "Number of cash observations documented by the count team.",
      id: "countObservations",
      kind: "integer",
      label: "Count observations",
      minimum: 1,
    },
    {
      id: "countTeamIndependent",
      kind: "boolean",
      label: "Count team independent",
    },
    {
      id: "locationSelectedByAuditor",
      kind: "boolean",
      label: "Location selected by auditor",
    },
    {
      id: "performedOnScheduledDate",
      kind: "boolean",
      label: "Performed on scheduled date",
    },
    { id: "wasAnnounced", kind: "boolean", label: "Count announced" },
  ],
  outputs: [
    {
      id: "observationCountValid",
      kind: "boolean",
      label: "Observation count valid",
    },
    {
      id: "validSurpriseCount",
      kind: "boolean",
      label: "Valid surprise count",
    },
    { id: "violationCount", kind: "integer", label: "Violations", minimum: 0 },
    { id: "violations", kind: "stringList", label: "Violation labels" },
  ],
  title: "Surprise Cash Count Unannounced Rotation Checker",
});

export const runSurpriseCashCount = surpriseCashCountTool.execute;
export default surpriseCashCountTool;
