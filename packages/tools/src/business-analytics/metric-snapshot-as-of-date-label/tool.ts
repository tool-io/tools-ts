import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metricCode: string;
  readonly periodLabel: string;
  readonly asOfDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metricCode: { type: "string", maxLength: 8192, minLength: 1 },
    periodLabel: { type: "string", maxLength: 8192, minLength: 1 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["metricCode", "periodLabel", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly dated metric snapshot without recalculating or verifying the underlying metric. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metricCode, periodLabel, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(metricCode.length > 0 && periodLabel.length > 0, "metricCode");
    namedDate(asOfDate, "asOfDate");
    return {
      label: metricCode + " [" + periodLabel + "; as of " + asOfDate + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { metricCode: "MRR", periodLabel: "2026-10", asOfDate: "2026-11-01" },
  output: { label: "MRR [2026-10; as of 2026-11-01]" },
} satisfies ToolExample<Input, Output>;
export const metricSnapshotAsOfDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/metric-snapshot-as-of-date-label",
    title: "Metric Snapshot As Of Date Label",
    description:
      "Label an explicitly dated metric snapshot without recalculating or verifying the underlying metric.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        metricCode: { type: "string", maxLength: 8192, minLength: 1 },
        periodLabel: { type: "string", maxLength: 8192, minLength: 1 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["metricCode", "periodLabel", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "metricCode",
          label: "Metric Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "periodLabel",
          label: "Period Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = metricSnapshotAsOfDateLabelTool.execute;
export default metricSnapshotAsOfDateLabelTool;
