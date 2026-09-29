import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurement: number;
  readonly fishLength: number;
  readonly referenceLength: number;
  readonly allometricExponent: number;
};
export type Output = { readonly standardized: number; readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurement: { type: "number", minimum: 0 },
    fishLength: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    allometricExponent: { type: "number" },
  },
  required: [
    "measurement",
    "fishLength",
    "referenceLength",
    "allometricExponent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardized: { type: "number" }, factor: { type: "number" } },
  required: ["standardized", "factor"],
} as const;
/** Caller-fitted allometric size standardization M*(Lref/L)^b, not a universal morphometric adjustment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurement, fishLength, referenceLength, allometricExponent } =
    request;
  const compute = (): Output => {
    H.domain(measurement >= 0);
    H.positive(fishLength);
    H.positive(referenceLength);
    return {
      standardized:
        measurement * (referenceLength / fishLength) ** allometricExponent,
      factor: (referenceLength / fishLength) ** allometricExponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measurement: 20,
    fishLength: 100,
    referenceLength: 200,
    allometricExponent: 1,
  },
  output: { standardized: 40, factor: 2 },
} satisfies ToolExample<Input, Output>;
export const fishMorphometricSizeStandardizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/fish-morphometric-size-standardization-term",
      title: "Fish Morphometric Size Standardization Term Tool",
      description:
        "Caller-fitted allometric size standardization M*(Lref/L)^b, not a universal morphometric adjustment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measurement: { type: "number", minimum: 0 },
          fishLength: { type: "number", exclusiveMinimum: 0 },
          referenceLength: { type: "number", exclusiveMinimum: 0 },
          allometricExponent: { type: "number" },
        },
        required: [
          "measurement",
          "fishLength",
          "referenceLength",
          "allometricExponent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardized: { type: "number" },
          factor: { type: "number" },
        },
        required: ["standardized", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "measurement",
            label: "Measurement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fishLength",
            label: "Fish Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceLength",
            label: "Reference Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allometricExponent",
            label: "Allometric Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardized",
            label: "Standardized",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = fishMorphometricSizeStandardizationTermTool.execute;
export default fishMorphometricSizeStandardizationTermTool;
