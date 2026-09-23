import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dilutionFraction: number;
  readonly reportedReciprocal: number;
};
export type Output = { readonly reciprocal: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dilutionFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    reportedReciprocal: { type: "number", minimum: 0 },
  },
  required: ["dilutionFraction", "reportedReciprocal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reciprocal: { type: "number" }, residual: { type: "number" } },
  required: ["reciprocal", "residual"],
} as const;
/** Check reciprocal dilution notation without inferring an assay endpoint or clinical meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dilutionFraction, reportedReciprocal } = request;
  const compute = (): Output => {
    H.domain(
      dilutionFraction > 0 && dilutionFraction <= 1 && reportedReciprocal >= 0,
    );
    return {
      reciprocal: 1 / dilutionFraction,
      residual: reportedReciprocal - 1 / dilutionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dilutionFraction: 0.01, reportedReciprocal: 100 },
  output: { reciprocal: 100, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const assayTitreReciprocalPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/assay-titre-reciprocal-pair",
    title: "Assay Titre Reciprocal Pair Tool",
    description:
      "Check reciprocal dilution notation without inferring an assay endpoint or clinical meaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dilutionFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        reportedReciprocal: { type: "number", minimum: 0 },
      },
      required: ["dilutionFraction", "reportedReciprocal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reciprocal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["reciprocal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "dilutionFraction",
          label: "Dilution Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "reportedReciprocal",
          label: "Reported Reciprocal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reciprocal",
          label: "Reciprocal",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = assayTitreReciprocalPairTool.execute;
export default assayTitreReciprocalPairTool;
