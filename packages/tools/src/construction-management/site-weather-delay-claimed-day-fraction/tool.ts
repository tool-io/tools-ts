import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimedDelayHours: number;
  readonly scheduledWorkHours: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimedDelayHours: { type: "number", minimum: 0 },
    scheduledWorkHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["claimedDelayHours", "scheduledWorkHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied claimed weather-delay fraction and unclaimed hours without determining contractual entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimedDelayHours, scheduledWorkHours } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(scheduledWorkHours) && scheduledWorkHours > 0,
      "scheduledWorkHours",
    ),
      scheduledWorkHours);
    H.domain(
      claimedDelayHours >= 0 && claimedDelayHours <= scheduledWorkHours,
      "claimedDelayHours",
    );
    return {
      fraction: claimedDelayHours / scheduledWorkHours,
      remainder: scheduledWorkHours - claimedDelayHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimedDelayHours: 30, scheduledWorkHours: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const siteWeatherDelayClaimedDayFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/site-weather-delay-claimed-day-fraction",
    title: "Site Weather Delay Claimed Day Fraction",
    description:
      "Calculate a supplied claimed weather-delay fraction and unclaimed hours without determining contractual entitlement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimedDelayHours: { type: "number", minimum: 0 },
        scheduledWorkHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["claimedDelayHours", "scheduledWorkHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "claimedDelayHours",
          label: "Claimed Delay Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduledWorkHours",
          label: "Scheduled Work Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = siteWeatherDelayClaimedDayFractionTool.execute;
export default siteWeatherDelayClaimedDayFractionTool;
