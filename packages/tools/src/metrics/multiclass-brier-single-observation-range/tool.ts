import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly classes: number; readonly normalized: boolean };
export type Output = { readonly minimum: number; readonly maximum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classes: { type: "integer", minimum: 2 },
    normalized: { type: "boolean" },
  },
  required: ["classes", "normalized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "number" }, maximum: { type: "number" } },
  required: ["minimum", "maximum"],
} as const;
/** Give the simplex one-hot multiclass Brier range for sum-of-squares or class-averaged normalization. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { classes, normalized } = input;
  const compute = (): Output => {
    H.integer(classes, 2);
    return { minimum: 0, maximum: normalized ? 2 / classes : 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { classes: 4, normalized: false },
  output: { minimum: 0, maximum: 2 },
} satisfies ToolExample<Input, Output>;
export const multiclassBrierSingleObservationRangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "metrics/multiclass-brier-single-observation-range",
      title: "Multiclass Brier Single Observation Range Tool",
      description:
        "Give the simplex one-hot multiclass Brier range for sum-of-squares or class-averaged normalization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          classes: { type: "integer", minimum: 2 },
          normalized: { type: "boolean" },
        },
        required: ["classes", "normalized"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimum: { type: "number" },
          maximum: { type: "number" },
        },
        required: ["minimum", "maximum"],
      },
      ports: {
        inputs: [
          {
            id: "classes",
            label: "Classes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "normalized",
            label: "Normalized",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "minimum", label: "Minimum", valueType: { type: "number" } },
          { id: "maximum", label: "Maximum", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = multiclassBrierSingleObservationRangeTool.execute;
export default multiclassBrierSingleObservationRangeTool;
