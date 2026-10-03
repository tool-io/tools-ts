import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventDay: number;
  readonly discoveryDay: number;
  readonly reportDay: number;
  readonly allowedLag: number;
};
export type Output = {
  readonly discoveryLag: number;
  readonly reportingLag: number;
  readonly totalLag: number;
  readonly reportWithinLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventDay: { type: "integer" },
    discoveryDay: { type: "integer" },
    reportDay: { type: "integer" },
    allowedLag: { type: "integer", minimum: 0 },
  },
  required: ["eventDay", "discoveryDay", "reportDay", "allowedLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discoveryLag: { type: "integer" },
    reportingLag: { type: "integer" },
    totalLag: { type: "integer" },
    reportWithinLimit: { type: "boolean" },
  },
  required: ["discoveryLag", "reportingLag", "totalLag", "reportWithinLimit"],
} as const;
/** Calculate deviation discovery report lag term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventDay, discoveryDay, reportDay, allowedLag } = request;
  const compute = (): Output => {
    H.integer(allowedLag, 0);
    H.domain(discoveryDay >= eventDay && reportDay >= discoveryDay);
    return {
      discoveryLag: discoveryDay - eventDay,
      reportingLag: reportDay - discoveryDay,
      totalLag: reportDay - eventDay,
      reportWithinLimit: reportDay - discoveryDay <= allowedLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventDay: 100, discoveryDay: 103, reportDay: 105, allowedLag: 3 },
  output: {
    discoveryLag: 3,
    reportingLag: 2,
    totalLag: 5,
    reportWithinLimit: true,
  },
} satisfies ToolExample<Input, Output>;
export const deviationDiscoveryReportLagTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/deviation-discovery-report-lag-term",
    title: "Deviation Discovery Report Lag Term Tool",
    description:
      "Calculate deviation discovery report lag term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventDay: { type: "integer" },
        discoveryDay: { type: "integer" },
        reportDay: { type: "integer" },
        allowedLag: { type: "integer", minimum: 0 },
      },
      required: ["eventDay", "discoveryDay", "reportDay", "allowedLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discoveryLag: { type: "integer" },
        reportingLag: { type: "integer" },
        totalLag: { type: "integer" },
        reportWithinLimit: { type: "boolean" },
      },
      required: [
        "discoveryLag",
        "reportingLag",
        "totalLag",
        "reportWithinLimit",
      ],
    },
    ports: {
      inputs: [
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "discoveryDay",
          label: "Discovery Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportDay",
          label: "Report Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedLag",
          label: "Allowed Lag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "discoveryLag",
          label: "Discovery Lag",
          valueType: { type: "integer" },
        },
        {
          id: "reportingLag",
          label: "Reporting Lag",
          valueType: { type: "integer" },
        },
        { id: "totalLag", label: "Total Lag", valueType: { type: "integer" } },
        {
          id: "reportWithinLimit",
          label: "Report Within Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = deviationDiscoveryReportLagTermTool.execute;
export default deviationDiscoveryReportLagTermTool;
