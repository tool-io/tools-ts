import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exponent: number;
  readonly targetLengthInSourceUnits: number;
};
export type Output = { readonly convertedExponent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponent: { type: "number", exclusiveMinimum: 0 },
    targetLengthInSourceUnits: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exponent", "targetLengthInSourceUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedExponent: { type: "number" } },
  required: ["convertedExponent"],
} as const;
/** Gaussian exp(-alpha*r²) exponent conversion when the target length unit has the supplied size in source units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exponent, targetLengthInSourceUnits } = request;
  const compute = (): Output => {
    H.positive(exponent);
    H.positive(targetLengthInSourceUnits);
    return { convertedExponent: exponent * targetLengthInSourceUnits ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exponent: 2, targetLengthInSourceUnits: 0.5 },
  output: { convertedExponent: 0.5 },
} satisfies ToolExample<Input, Output>;
export const basisExponentLengthUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/basis-exponent-length-unit-factor",
    title: "Basis Exponent Length Unit Factor Tool",
    description:
      "Gaussian exp(-alpha*r²) exponent conversion when the target length unit has the supplied size in source units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exponent: { type: "number", exclusiveMinimum: 0 },
        targetLengthInSourceUnits: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exponent", "targetLengthInSourceUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedExponent: { type: "number" } },
      required: ["convertedExponent"],
    },
    ports: {
      inputs: [
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLengthInSourceUnits",
          label: "Target Length In Source Units",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedExponent",
          label: "Converted Exponent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = basisExponentLengthUnitFactorTool.execute;
export default basisExponentLengthUnitFactorTool;
