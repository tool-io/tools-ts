import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reports: number;
  readonly hoursPerReport: number;
  readonly hourlyCost: number;
  readonly fixedPerReport: number;
};
export type Output = {
  readonly totalHours: number;
  readonly laborCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reports: { type: "integer", minimum: 0 },
    hoursPerReport: { type: "number", minimum: 0 },
    hourlyCost: { type: "number", minimum: 0 },
    fixedPerReport: { type: "number", minimum: 0 },
  },
  required: ["reports", "hoursPerReport", "hourlyCost", "fixedPerReport"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalHours: { type: "number" },
    laborCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["totalHours", "laborCost", "totalCost"],
} as const;
/** Calculate regulatory cost one report hour from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reports, hoursPerReport, hourlyCost, fixedPerReport } = request;
  const compute = (): Output => {
    H.integer(reports, 0);
    H.domain(hoursPerReport >= 0 && hourlyCost >= 0 && fixedPerReport >= 0);
    return {
      totalHours: reports * hoursPerReport,
      laborCost: reports * hoursPerReport * hourlyCost,
      totalCost: reports * (hoursPerReport * hourlyCost + fixedPerReport),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reports: 12, hoursPerReport: 2, hourlyCost: 30, fixedPerReport: 10 },
  output: { totalHours: 24, laborCost: 720, totalCost: 840 },
} satisfies ToolExample<Input, Output>;
export const regulatoryCostOneReportHourTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/regulatory-cost-one-report-hour",
    title: "Regulatory Cost One Report Hour Tool",
    description:
      "Calculate regulatory cost one report hour from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reports: { type: "integer", minimum: 0 },
        hoursPerReport: { type: "number", minimum: 0 },
        hourlyCost: { type: "number", minimum: 0 },
        fixedPerReport: { type: "number", minimum: 0 },
      },
      required: ["reports", "hoursPerReport", "hourlyCost", "fixedPerReport"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalHours: { type: "number" },
        laborCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["totalHours", "laborCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "reports",
          label: "Reports",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hoursPerReport",
          label: "Hours Per Report",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyCost",
          label: "Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedPerReport",
          label: "Fixed Per Report",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalHours",
          label: "Total Hours",
          valueType: { type: "number" },
        },
        { id: "laborCost", label: "Labor Cost", valueType: { type: "number" } },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = regulatoryCostOneReportHourTool.execute;
export default regulatoryCostOneReportHourTool;
