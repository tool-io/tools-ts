import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enrolled: number;
  readonly siteMonths: number;
  readonly activeSites: number;
  readonly forecastMonths: number;
};
export type Output = {
  readonly ratePerSiteMonth: number;
  readonly conditionalForecast: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enrolled: { type: "integer", minimum: 0 },
    siteMonths: { type: "number", exclusiveMinimum: 0 },
    activeSites: { type: "integer", minimum: 0 },
    forecastMonths: { type: "number", minimum: 0 },
  },
  required: ["enrolled", "siteMonths", "activeSites", "forecastMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratePerSiteMonth: { type: "number" },
    conditionalForecast: { type: "number" },
  },
  required: ["ratePerSiteMonth", "conditionalForecast"],
} as const;
/** Supplied recruitment-effort rate and constant-rate scenario arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enrolled, siteMonths, activeSites, forecastMonths } = request;
  const compute = (): Output => {
    H.integer(enrolled, 0);
    H.positive(siteMonths);
    H.integer(activeSites, 0);
    H.domain(forecastMonths >= 0);
    return {
      ratePerSiteMonth: enrolled / siteMonths,
      conditionalForecast:
        (enrolled * activeSites * forecastMonths) / siteMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { enrolled: 60, siteMonths: 12, activeSites: 4, forecastMonths: 3 },
  output: { ratePerSiteMonth: 5, conditionalForecast: 60 },
} satisfies ToolExample<Input, Output>;
export const trialRecruitmentRateSiteMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-recruitment-rate-site-month-term",
    title: "Trial Recruitment Rate Site Month Term Tool",
    description:
      "Supplied recruitment-effort rate and constant-rate scenario arithmetic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enrolled: { type: "integer", minimum: 0 },
        siteMonths: { type: "number", exclusiveMinimum: 0 },
        activeSites: { type: "integer", minimum: 0 },
        forecastMonths: { type: "number", minimum: 0 },
      },
      required: ["enrolled", "siteMonths", "activeSites", "forecastMonths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratePerSiteMonth: { type: "number" },
        conditionalForecast: { type: "number" },
      },
      required: ["ratePerSiteMonth", "conditionalForecast"],
    },
    ports: {
      inputs: [
        {
          id: "enrolled",
          label: "Enrolled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "siteMonths",
          label: "Site Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeSites",
          label: "Active Sites",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "forecastMonths",
          label: "Forecast Months",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ratePerSiteMonth",
          label: "Rate Per Site Month",
          valueType: { type: "number" },
        },
        {
          id: "conditionalForecast",
          label: "Conditional Forecast",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialRecruitmentRateSiteMonthTermTool.execute;
export default trialRecruitmentRateSiteMonthTermTool;
