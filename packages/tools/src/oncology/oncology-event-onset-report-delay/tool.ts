import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetLower: number;
  readonly onsetUpper: number;
  readonly reportTime: number;
};
export type Output = {
  readonly minimumDelay: number;
  readonly maximumDelay: number;
  readonly midpointDelay: number;
  readonly reportedBeforePossibleOnset: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetLower: { type: "number" },
    onsetUpper: { type: "number" },
    reportTime: { type: "number" },
  },
  required: ["onsetLower", "onsetUpper", "reportTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumDelay: { type: "number" },
    maximumDelay: { type: "number" },
    midpointDelay: { type: "number" },
    reportedBeforePossibleOnset: { type: "boolean" },
  },
  required: [
    "minimumDelay",
    "maximumDelay",
    "midpointDelay",
    "reportedBeforePossibleOnset",
  ],
} as const;
/** Signed report-delay interval from a supplied uncertain onset-time window, without an adverse-event or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetLower, onsetUpper, reportTime } = request;
  const compute = (): Output => {
    H.domain(onsetUpper >= onsetLower);
    return {
      minimumDelay: reportTime - onsetUpper,
      maximumDelay: reportTime - onsetLower,
      midpointDelay: reportTime - (onsetLower + onsetUpper) / 2,
      reportedBeforePossibleOnset: reportTime < onsetLower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onsetLower: 10, onsetUpper: 14, reportTime: 20 },
  output: {
    minimumDelay: 6,
    maximumDelay: 10,
    midpointDelay: 8,
    reportedBeforePossibleOnset: false,
  },
} satisfies ToolExample<Input, Output>;
export const oncologyEventOnsetReportDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/oncology-event-onset-report-delay",
    title: "Oncology Event Onset Report Delay Tool",
    description:
      "Signed report-delay interval from a supplied uncertain onset-time window, without an adverse-event or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onsetLower: { type: "number" },
        onsetUpper: { type: "number" },
        reportTime: { type: "number" },
      },
      required: ["onsetLower", "onsetUpper", "reportTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumDelay: { type: "number" },
        maximumDelay: { type: "number" },
        midpointDelay: { type: "number" },
        reportedBeforePossibleOnset: { type: "boolean" },
      },
      required: [
        "minimumDelay",
        "maximumDelay",
        "midpointDelay",
        "reportedBeforePossibleOnset",
      ],
    },
    ports: {
      inputs: [
        {
          id: "onsetLower",
          label: "Onset Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onsetUpper",
          label: "Onset Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportTime",
          label: "Report Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumDelay",
          label: "Minimum Delay",
          valueType: { type: "number" },
        },
        {
          id: "maximumDelay",
          label: "Maximum Delay",
          valueType: { type: "number" },
        },
        {
          id: "midpointDelay",
          label: "Midpoint Delay",
          valueType: { type: "number" },
        },
        {
          id: "reportedBeforePossibleOnset",
          label: "Reported Before Possible Onset",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = oncologyEventOnsetReportDelayTool.execute;
export default oncologyEventOnsetReportDelayTool;
