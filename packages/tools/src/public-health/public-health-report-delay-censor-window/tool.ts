import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onsetDay: number;
  readonly reportDay: number;
  readonly cutoffDay: number;
  readonly reported: boolean;
};
export type Output = {
  readonly delayDays: number;
  readonly exact: boolean;
  readonly included: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onsetDay: { type: "integer" },
    reportDay: { type: "integer" },
    cutoffDay: { type: "integer" },
    reported: { type: "boolean" },
  },
  required: ["onsetDay", "reportDay", "cutoffDay", "reported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delayDays: { type: "integer" },
    exact: { type: "boolean" },
    included: { type: "boolean" },
  },
  required: ["delayDays", "exact", "included"],
} as const;
/** Report an observed reporting delay or an explicit right-censor duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onsetDay, reportDay, cutoffDay, reported } = request;
  const compute = (): Output => {
    H.domain(cutoffDay >= onsetDay && (!reported || reportDay >= onsetDay));
    return {
      delayDays: (reported ? reportDay : cutoffDay) - onsetDay,
      exact: reported,
      included: reported && reportDay <= cutoffDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onsetDay: 100, reportDay: 108, cutoffDay: 110, reported: true },
  output: { delayDays: 8, exact: true, included: true },
} satisfies ToolExample<Input, Output>;
export const publicHealthReportDelayCensorWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/public-health-report-delay-censor-window",
      title: "Public Health Report Delay Censor Window Tool",
      description:
        "Report an observed reporting delay or an explicit right-censor duration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          onsetDay: { type: "integer" },
          reportDay: { type: "integer" },
          cutoffDay: { type: "integer" },
          reported: { type: "boolean" },
        },
        required: ["onsetDay", "reportDay", "cutoffDay", "reported"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          delayDays: { type: "integer" },
          exact: { type: "boolean" },
          included: { type: "boolean" },
        },
        required: ["delayDays", "exact", "included"],
      },
      ports: {
        inputs: [
          {
            id: "onsetDay",
            label: "Onset Day",
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
            id: "cutoffDay",
            label: "Cutoff Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reported",
            label: "Reported",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "delayDays",
            label: "Delay Days",
            valueType: { type: "integer" },
          },
          { id: "exact", label: "Exact", valueType: { type: "boolean" } },
          { id: "included", label: "Included", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = publicHealthReportDelayCensorWindowTool.execute;
export default publicHealthReportDelayCensorWindowTool;
