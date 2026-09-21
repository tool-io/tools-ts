import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly cutoffDays: number;
  readonly equalityRefundable: boolean;
};
export type Output = { readonly refundSide: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer", minimum: 0 },
    cutoffDays: { type: "integer", minimum: 0 },
    equalityRefundable: { type: "boolean" },
  },
  required: ["elapsedDays", "cutoffDays", "equalityRefundable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { refundSide: { type: "string", maxLength: 8192 } },
  required: ["refundSide"],
} as const;
/** Classify a supplied refund timing band without selecting a legal or provider policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDays, cutoffDays, equalityRefundable } = request;
  const compute = (): Output => {
    H.integer(elapsedDays, 0);
    H.integer(cutoffDays, 0);
    return {
      refundSide:
        elapsedDays < cutoffDays ||
        (elapsedDays === cutoffDays && equalityRefundable)
          ? "eligible-band"
          : "later-band",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedDays: 7, cutoffDays: 7, equalityRefundable: true },
  output: { refundSide: "eligible-band" },
} satisfies ToolExample<Input, Output>;
export const adultCourseRefundBandTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/adult-course-refund-band-token",
    title: "Adult Course Refund Band Token Tool",
    description:
      "Classify a supplied refund timing band without selecting a legal or provider policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "integer", minimum: 0 },
        cutoffDays: { type: "integer", minimum: 0 },
        equalityRefundable: { type: "boolean" },
      },
      required: ["elapsedDays", "cutoffDays", "equalityRefundable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { refundSide: { type: "string", maxLength: 8192 } },
      required: ["refundSide"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cutoffDays",
          label: "Cutoff Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "equalityRefundable",
          label: "Equality Refundable",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "refundSide",
          label: "Refund Side",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = adultCourseRefundBandTokenTool.execute;
export default adultCourseRefundBandTokenTool;
