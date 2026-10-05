import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rating: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
  readonly recallDays: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rating: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
    recallDays: { type: "integer", minimum: 1 },
  },
  required: ["rating", "scaleMinimum", "scaleMaximum", "recallDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied symptom rating and caller-defined scale with its explicit recall duration; no diagnostic cutoff is assigned. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rating, scaleMinimum, scaleMaximum, recallDays } = request;
  const compute = (): Output => {
    H.domain(
      scaleMinimum < scaleMaximum &&
        rating >= scaleMinimum &&
        rating <= scaleMaximum,
      "scaleMinimum",
    );
    (H.domain(
      Number.isSafeInteger(recallDays) &&
        recallDays >= 1 &&
        recallDays <= Number.MAX_SAFE_INTEGER,
      "recallDays",
    ),
      recallDays);
    return {
      label:
        rating +
        " [" +
        scaleMinimum +
        ", " +
        scaleMaximum +
        "]; recall " +
        recallDays +
        " days",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rating: 4, scaleMinimum: 0, scaleMaximum: 10, recallDays: 7 },
  output: { label: "4 [0, 10]; recall 7 days" },
} satisfies ToolExample<Input, Output>;
export const symptomRatingRecallPeriodLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/symptom-rating-recall-period-label",
    title: "Symptom Rating Recall Period Label Tool",
    description:
      "Label a supplied symptom rating and caller-defined scale with its explicit recall duration; no diagnostic cutoff is assigned.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rating: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
        recallDays: { type: "integer", minimum: 1 },
      },
      required: ["rating", "scaleMinimum", "scaleMaximum", "recallDays"],
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
          id: "rating",
          label: "Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMinimum",
          label: "Scale Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMaximum",
          label: "Scale Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallDays",
          label: "Recall Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = symptomRatingRecallPeriodLabelTool.execute;
export default symptomRatingRecallPeriodLabelTool;
