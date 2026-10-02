import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedSites: number;
  readonly missingSites: number;
  readonly excludedSites: number;
  readonly missingExcludedOverlap: number;
};
export type Output = { readonly observedBase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedSites: { type: "integer", minimum: 0 },
    missingSites: { type: "integer", minimum: 0 },
    excludedSites: { type: "integer", minimum: 0 },
    missingExcludedOverlap: { type: "integer", minimum: 0 },
  },
  required: [
    "plannedSites",
    "missingSites",
    "excludedSites",
    "missingExcludedOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observedBase: { type: "integer" } },
  required: ["observedBase"],
} as const;
/** Supplied site-observation inventory only, without imputing periodontal findings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedSites, missingSites, excludedSites, missingExcludedOverlap } =
    request;
  const compute = (): Output => {
    H.integer(plannedSites, 0);
    H.integer(missingSites, 0, plannedSites);
    H.integer(excludedSites, 0, plannedSites);
    H.integer(missingExcludedOverlap, 0, Math.min(missingSites, excludedSites));
    H.domain(
      missingSites + excludedSites - missingExcludedOverlap <= plannedSites,
    );
    return {
      observedBase:
        plannedSites - missingSites - excludedSites + missingExcludedOverlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plannedSites: 30,
    missingSites: 4,
    excludedSites: 3,
    missingExcludedOverlap: 1,
  },
  output: { observedBase: 24 },
} satisfies ToolExample<Input, Output>;
export const toothSiteObservationDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/tooth-site-observation-denominator",
    title: "Tooth Site Observation Denominator Tool",
    description:
      "Supplied site-observation inventory only, without imputing periodontal findings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedSites: { type: "integer", minimum: 0 },
        missingSites: { type: "integer", minimum: 0 },
        excludedSites: { type: "integer", minimum: 0 },
        missingExcludedOverlap: { type: "integer", minimum: 0 },
      },
      required: [
        "plannedSites",
        "missingSites",
        "excludedSites",
        "missingExcludedOverlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { observedBase: { type: "integer" } },
      required: ["observedBase"],
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
          id: "missingSites",
          label: "Missing Sites",
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
          id: "missingExcludedOverlap",
          label: "Missing Excluded Overlap",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "observedBase",
          label: "Observed Base",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = toothSiteObservationDenominatorTool.execute;
export default toothSiteObservationDenominatorTool;
