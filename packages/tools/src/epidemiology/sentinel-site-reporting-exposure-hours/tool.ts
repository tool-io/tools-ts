import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledHours: number;
  readonly missingHours: number;
};
export type Output = { readonly reportingExposureHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledHours: { type: "number", minimum: 0 },
    missingHours: { type: "number", minimum: 0 },
  },
  required: ["scheduledHours", "missingHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reportingExposureHours: { type: "number" } },
  required: ["reportingExposureHours"],
} as const;
/** Subtract supplied missing-report hours from scheduled sentinel reporting duration without estimating disease occurrence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledHours, missingHours } = request;
  const compute = (): Output => {
    H.domain(scheduledHours >= 0, "scheduledHours");
    H.domain(
      missingHours >= 0 && missingHours <= scheduledHours,
      "missingHours",
    );
    return { reportingExposureHours: scheduledHours - missingHours };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledHours: 24, missingHours: 4 },
  output: { reportingExposureHours: 20 },
} satisfies ToolExample<Input, Output>;
export const sentinelSiteReportingExposureHoursTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/sentinel-site-reporting-exposure-hours",
    title: "Sentinel Site Reporting Exposure Hours Tool",
    description:
      "Subtract supplied missing-report hours from scheduled sentinel reporting duration without estimating disease occurrence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledHours: { type: "number", minimum: 0 },
        missingHours: { type: "number", minimum: 0 },
      },
      required: ["scheduledHours", "missingHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reportingExposureHours: { type: "number" } },
      required: ["reportingExposureHours"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledHours",
          label: "Scheduled Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingHours",
          label: "Missing Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reportingExposureHours",
          label: "Reporting Exposure Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sentinelSiteReportingExposureHoursTool.execute;
export default sentinelSiteReportingExposureHoursTool;
