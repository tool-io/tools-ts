import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as partitionCoefficients } from "../../polynomial/coefficient-even-odd-partition/tool.js";
export type Input = {
  readonly coefficient: number;
  readonly exponent: number;
  readonly requestedPart: string;
};
export type Output = { readonly selectedCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "number" },
    exponent: { type: "integer", minimum: 0, maximum: 255 },
    requestedPart: { type: "string", maxLength: 8192, enum: ["even", "odd"] },
  },
  required: ["coefficient", "exponent", "requestedPart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selectedCoefficient: { type: "number" } },
  required: ["selectedCoefficient"],
} as const;
/** One scalar coefficient of the parity decomposition, indexed by its supplied exponent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficient, exponent, requestedPart } = request;
  const compute = (): Output => {
    H.integer(exponent, 0, 255);
    H.domain(["even", "odd"].includes(requestedPart));
    const coefficients = Array(exponent + 1).fill(0);
    coefficients[exponent] = coefficient;
    const partition = partitionCoefficients({ coefficients });
    const selectedCoefficient = (
      requestedPart === "even" ? partition.result.even : partition.result.odd
    )[exponent];
    return { selectedCoefficient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficient: 7, exponent: 3, requestedPart: "odd" },
  output: { selectedCoefficient: 7 },
} satisfies ToolExample<Input, Output>;
export const polynomialEvenOddPartCoefficientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/polynomial-even-odd-part-coefficient",
    title: "Polynomial Even Odd Part Coefficient Tool",
    description:
      "One scalar coefficient of the parity decomposition, indexed by its supplied exponent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficient: { type: "number" },
        exponent: { type: "integer", minimum: 0, maximum: 255 },
        requestedPart: {
          type: "string",
          maxLength: 8192,
          enum: ["even", "odd"],
        },
      },
      required: ["coefficient", "exponent", "requestedPart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { selectedCoefficient: { type: "number" } },
      required: ["selectedCoefficient"],
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
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requestedPart",
          label: "Requested Part",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "selectedCoefficient",
          label: "Selected Coefficient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = polynomialEvenOddPartCoefficientTool.execute;
export default polynomialEvenOddPartCoefficientTool;
