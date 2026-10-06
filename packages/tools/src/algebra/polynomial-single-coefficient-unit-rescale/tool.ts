import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficient: number;
  readonly termDegree: number;
  readonly argumentScale: number;
};
export type Output = { readonly rescaledCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "number" },
    termDegree: { type: "integer", minimum: 0 },
    argumentScale: { type: "number" },
  },
  required: ["coefficient", "termDegree", "argumentScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rescaledCoefficient: { type: "number" } },
  required: ["rescaledCoefficient"],
} as const;
/** Rescale one explicit ascending-power polynomial coefficient for substitution x=argumentScale*y, with degree-zero scale interpreted as one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficient, termDegree, argumentScale } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(termDegree) &&
        termDegree >= 0 &&
        termDegree <= Number.MAX_SAFE_INTEGER,
      "termDegree",
    ),
      termDegree);
    return {
      rescaledCoefficient: coefficient * Math.pow(argumentScale, termDegree),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficient: 3, termDegree: 2, argumentScale: 2 },
  output: { rescaledCoefficient: 12 },
} satisfies ToolExample<Input, Output>;
export const polynomialSingleCoefficientUnitRescaleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["algebra", "mathematics"],
        keywords: ["algebra", "mathematics"],
      },
      id: "algebra/polynomial-single-coefficient-unit-rescale",
      title: "Polynomial Single Coefficient Unit Rescale",
      description:
        "Rescale one explicit ascending-power polynomial coefficient for substitution x=argumentScale*y, with degree-zero scale interpreted as one.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coefficient: { type: "number" },
          termDegree: { type: "integer", minimum: 0 },
          argumentScale: { type: "number" },
        },
        required: ["coefficient", "termDegree", "argumentScale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { rescaledCoefficient: { type: "number" } },
        required: ["rescaledCoefficient"],
      },
      ports: {
        inputs: [
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "termDegree",
            label: "Term Degree",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "argumentScale",
            label: "Argument Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rescaledCoefficient",
            label: "Rescaled Coefficient",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = polynomialSingleCoefficientUnitRescaleTool.execute;
export default polynomialSingleCoefficientUnitRescaleTool;
