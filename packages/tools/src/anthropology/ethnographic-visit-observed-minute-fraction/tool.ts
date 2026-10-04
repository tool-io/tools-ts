import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMinutes: number;
  readonly visitMinutes: number;
};
export type Output = {
  readonly observedFraction: number;
  readonly unobservedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMinutes: { type: "number", minimum: 0 },
    visitMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedMinutes", "visitMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedFraction: { type: "number" },
    unobservedMinutes: { type: "number" },
  },
  required: ["observedFraction", "unobservedMinutes"],
} as const;
/** Describe observed coverage of a field visit without imputing unobserved activities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMinutes, visitMinutes } = request;
  const compute = (): Output => {
    (H.domain(visitMinutes > 0, "visitMinutes"), visitMinutes);
    H.domain(
      observedMinutes >= 0 && observedMinutes <= visitMinutes,
      "observedMinutes",
    );
    return {
      observedFraction: observedMinutes / visitMinutes,
      unobservedMinutes: visitMinutes - observedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMinutes: 45, visitMinutes: 60 },
  output: { observedFraction: 0.75, unobservedMinutes: 15 },
} satisfies ToolExample<Input, Output>;
export const ethnographicVisitObservedMinuteFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anthropology/ethnographic-visit-observed-minute-fraction",
      title: "Ethnographic Visit Observed Minute Fraction Tool",
      description:
        "Describe observed coverage of a field visit without imputing unobserved activities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedMinutes: { type: "number", minimum: 0 },
          visitMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observedMinutes", "visitMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedFraction: { type: "number" },
          unobservedMinutes: { type: "number" },
        },
        required: ["observedFraction", "unobservedMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "observedMinutes",
            label: "Observed Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "visitMinutes",
            label: "Visit Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedFraction",
            label: "Observed Fraction",
            valueType: { type: "number" },
          },
          {
            id: "unobservedMinutes",
            label: "Unobserved Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ethnographicVisitObservedMinuteFractionTool.execute;
export default ethnographicVisitObservedMinuteFractionTool;
