import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedSites: number;
  readonly excludedSites: number;
  readonly measuredSites: number;
};
export type Output = {
  readonly eligibleSites: number;
  readonly unmeasuredEligibleSites: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedSites: { type: "integer", minimum: 0 },
    excludedSites: { type: "integer", minimum: 0 },
    measuredSites: { type: "integer", minimum: 0 },
  },
  required: ["plannedSites", "excludedSites", "measuredSites"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleSites: { type: "integer" },
    unmeasuredEligibleSites: { type: "integer" },
  },
  required: ["eligibleSites", "unmeasuredEligibleSites"],
} as const;
/** Reconcile explicit planned, excluded, and measured tooth-site counts without inferring missing measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedSites, excludedSites, measuredSites } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plannedSites) &&
        plannedSites >= 0 &&
        plannedSites <= Number.MAX_SAFE_INTEGER,
      "plannedSites",
    ),
      plannedSites);
    (H.domain(
      Number.isSafeInteger(excludedSites) &&
        excludedSites >= 0 &&
        excludedSites <= plannedSites,
      "excludedSites",
    ),
      excludedSites);
    (H.domain(
      Number.isSafeInteger(measuredSites) &&
        measuredSites >= 0 &&
        measuredSites <= plannedSites - excludedSites,
      "measuredSites",
    ),
      measuredSites);
    return {
      eligibleSites: plannedSites - excludedSites,
      unmeasuredEligibleSites: plannedSites - excludedSites - measuredSites,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedSites: 6, excludedSites: 1, measuredSites: 4 },
  output: { eligibleSites: 5, unmeasuredEligibleSites: 1 },
} satisfies ToolExample<Input, Output>;
export const toothExcludedSiteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/tooth-excluded-site-count",
    title: "Tooth Excluded Site Count",
    description:
      "Reconcile explicit planned, excluded, and measured tooth-site counts without inferring missing measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedSites: { type: "integer", minimum: 0 },
        excludedSites: { type: "integer", minimum: 0 },
        measuredSites: { type: "integer", minimum: 0 },
      },
      required: ["plannedSites", "excludedSites", "measuredSites"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleSites: { type: "integer" },
        unmeasuredEligibleSites: { type: "integer" },
      },
      required: ["eligibleSites", "unmeasuredEligibleSites"],
    },
    ports: {
      inputs: [
        {
          id: "plannedSites",
          label: "Planned Sites",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedSites",
          label: "Excluded Sites",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "measuredSites",
          label: "Measured Sites",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eligibleSites",
          label: "Eligible Sites",
          valueType: { type: "integer" },
        },
        {
          id: "unmeasuredEligibleSites",
          label: "Unmeasured Eligible Sites",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = toothExcludedSiteCountTool.execute;
export default toothExcludedSiteCountTool;
