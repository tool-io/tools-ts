import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly reportTime: number;
  readonly eventOffset: number;
  readonly reportOffset: number;
};
export type Output = {
  readonly eventReference: number;
  readonly reportReference: number;
  readonly lag: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    reportTime: { type: "number" },
    eventOffset: { type: "number" },
    reportOffset: { type: "number" },
  },
  required: ["eventTime", "reportTime", "eventOffset", "reportOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventReference: { type: "number" },
    reportReference: { type: "number" },
    lag: { type: "number" },
  },
  required: ["eventReference", "reportReference", "lag"],
} as const;
/** Normalize supplied benign incident-record timestamps to an explicit common clock reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, reportTime, eventOffset, reportOffset } = request;
  const compute = (): Output => {
    return {
      eventReference: eventTime - eventOffset,
      reportReference: reportTime - reportOffset,
      lag: reportTime - reportOffset - eventTime + eventOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 100, reportTime: 110, eventOffset: 2, reportOffset: -1 },
  output: { eventReference: 98, reportReference: 111, lag: 13 },
} satisfies ToolExample<Input, Output>;
export const biosecurityIncidentReportClockOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-incident-report-clock-offset",
      title: "Biosecurity Incident Report Clock Offset Tool",
      description:
        "Normalize supplied benign incident-record timestamps to an explicit common clock reference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eventTime: { type: "number" },
          reportTime: { type: "number" },
          eventOffset: { type: "number" },
          reportOffset: { type: "number" },
        },
        required: ["eventTime", "reportTime", "eventOffset", "reportOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eventReference: { type: "number" },
          reportReference: { type: "number" },
          lag: { type: "number" },
        },
        required: ["eventReference", "reportReference", "lag"],
      },
      ports: {
        inputs: [
          {
            id: "eventTime",
            label: "Event Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportTime",
            label: "Report Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eventOffset",
            label: "Event Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportOffset",
            label: "Report Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "eventReference",
            label: "Event Reference",
            valueType: { type: "number" },
          },
          {
            id: "reportReference",
            label: "Report Reference",
            valueType: { type: "number" },
          },
          { id: "lag", label: "Lag", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityIncidentReportClockOffsetTool.execute;
export default biosecurityIncidentReportClockOffsetTool;
