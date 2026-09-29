import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewDay: number;
  readonly effectiveDay: number;
  readonly suppliedMaximumAge: number;
};
export type Output = {
  readonly ageDays: number;
  readonly ageMargin: number;
  readonly futureEffective: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewDay: { type: "integer" },
    effectiveDay: { type: "integer" },
    suppliedMaximumAge: { type: "integer", minimum: 0 },
  },
  required: ["reviewDay", "effectiveDay", "suppliedMaximumAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    ageMargin: { type: "integer" },
    futureEffective: { type: "boolean" },
  },
  required: ["ageDays", "ageMargin", "futureEffective"],
} as const;
/** Inspect supplied release-document vintage without certifying document validity or batch release. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewDay, effectiveDay, suppliedMaximumAge } = request;
  const compute = (): Output => {
    H.integer(suppliedMaximumAge, 0);
    return {
      ageDays: reviewDay - effectiveDay,
      ageMargin: suppliedMaximumAge - reviewDay + effectiveDay,
      futureEffective: effectiveDay > reviewDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reviewDay: 130, effectiveDay: 100, suppliedMaximumAge: 20 },
  output: { ageDays: 30, ageMargin: -10, futureEffective: false },
} satisfies ToolExample<Input, Output>;
export const releaseDocumentAgeTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "industrial-pharmacy/release-document-age",
    title: "Release Document Age Tool",
    description:
      "Inspect supplied release-document vintage without certifying document validity or batch release.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewDay: { type: "integer" },
        effectiveDay: { type: "integer" },
        suppliedMaximumAge: { type: "integer", minimum: 0 },
      },
      required: ["reviewDay", "effectiveDay", "suppliedMaximumAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        ageMargin: { type: "integer" },
        futureEffective: { type: "boolean" },
      },
      required: ["ageDays", "ageMargin", "futureEffective"],
    },
    ports: {
      inputs: [
        {
          id: "reviewDay",
          label: "Review Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effectiveDay",
          label: "Effective Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMaximumAge",
          label: "Supplied Maximum Age",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        {
          id: "ageMargin",
          label: "Age Margin",
          valueType: { type: "integer" },
        },
        {
          id: "futureEffective",
          label: "Future Effective",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = releaseDocumentAgeTool.execute;
export default releaseDocumentAgeTool;
