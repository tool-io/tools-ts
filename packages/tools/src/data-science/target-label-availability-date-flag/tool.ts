import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelAvailableDate: string;
  readonly trainingCutoffDate: string;
  readonly cutoffInclusive: boolean;
};
export type Output = { readonly availableByCutoff: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelAvailableDate: { type: "string", maxLength: 8192 },
    trainingCutoffDate: { type: "string", maxLength: 8192 },
    cutoffInclusive: { type: "boolean" },
  },
  required: ["labelAvailableDate", "trainingCutoffDate", "cutoffInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { availableByCutoff: { type: "boolean" } },
  required: ["availableByCutoff"],
} as const;
/** Compare an explicit target-label availability date with a supplied training cutoff convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelAvailableDate, trainingCutoffDate, cutoffInclusive } = request;
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
    const a = namedDate(labelAvailableDate, "labelAvailableDate").getTime(),
      b = namedDate(trainingCutoffDate, "trainingCutoffDate").getTime();
    return { availableByCutoff: cutoffInclusive ? a <= b : a < b };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    labelAvailableDate: "2026-10-31",
    trainingCutoffDate: "2026-11-01",
    cutoffInclusive: false,
  },
  output: { availableByCutoff: true },
} satisfies ToolExample<Input, Output>;
export const targetLabelAvailabilityDateFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/target-label-availability-date-flag",
    title: "Target Label Availability Date Flag",
    description:
      "Compare an explicit target-label availability date with a supplied training cutoff convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelAvailableDate: { type: "string", maxLength: 8192 },
        trainingCutoffDate: { type: "string", maxLength: 8192 },
        cutoffInclusive: { type: "boolean" },
      },
      required: ["labelAvailableDate", "trainingCutoffDate", "cutoffInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { availableByCutoff: { type: "boolean" } },
      required: ["availableByCutoff"],
    },
    ports: {
      inputs: [
        {
          id: "labelAvailableDate",
          label: "Label Available Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainingCutoffDate",
          label: "Training Cutoff Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cutoffInclusive",
          label: "Cutoff Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "availableByCutoff",
          label: "Available By Cutoff",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = targetLabelAvailabilityDateFlagTool.execute;
export default targetLabelAvailabilityDateFlagTool;
