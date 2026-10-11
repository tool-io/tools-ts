import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly termUnit: string;
  readonly coefficientUnit: string;
  readonly conventionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    termUnit: { type: "string", maxLength: 8192, minLength: 1 },
    coefficientUnit: { type: "string", maxLength: 8192, minLength: 1 },
    conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["termUnit", "coefficientUnit", "conventionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit recurrence term and coefficient unit convention without performing dimensional inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { termUnit, coefficientUnit, conventionSource } = request;
  const compute = (): Output => {
    H.domain(termUnit.length > 0, "termUnit");
    H.domain(coefficientUnit.length > 0, "coefficientUnit");
    H.domain(conventionSource.length > 0, "conventionSource");
    return {
      token: JSON.stringify([termUnit, coefficientUnit, conventionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    termUnit: "m",
    coefficientUnit: "dimensionless",
    conventionSource: "Model A",
  },
  output: { token: '["m","dimensionless","Model A"]' },
} satisfies ToolExample<Input, Output>;
export const recurrenceCoefficientUnitConsistencyTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["sequence", "mathematics"],
        keywords: ["sequence", "mathematics"],
      },
      id: "sequence/recurrence-coefficient-unit-consistency-tag",
      title: "Recurrence Coefficient Unit Consistency Tag",
      description:
        "Preserve an explicit recurrence term and coefficient unit convention without performing dimensional inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          termUnit: { type: "string", maxLength: 8192, minLength: 1 },
          coefficientUnit: { type: "string", maxLength: 8192, minLength: 1 },
          conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["termUnit", "coefficientUnit", "conventionSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "termUnit",
            label: "Term Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "coefficientUnit",
            label: "Coefficient Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "conventionSource",
            label: "Convention Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = recurrenceCoefficientUnitConsistencyTagTool.execute;
export default recurrenceCoefficientUnitConsistencyTagTool;
