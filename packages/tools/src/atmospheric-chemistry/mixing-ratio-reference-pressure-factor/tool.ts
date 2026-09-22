import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partialPressure: number;
  readonly totalPressure: number;
  readonly referencePressure: number;
};
export type Output = {
  readonly mixingFraction: number;
  readonly referencePartialPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partialPressure: { type: "number", minimum: 0 },
    totalPressure: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["partialPressure", "totalPressure", "referencePressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mixingFraction: { type: "number" },
    referencePartialPressure: { type: "number" },
  },
  required: ["mixingFraction", "referencePartialPressure"],
} as const;
/** Rescale a supplied ideal-gas partial pressure at constant mole fraction without inferring atmospheric composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partialPressure, totalPressure, referencePressure } = request;
  const compute = (): Output => {
    H.positive(totalPressure);
    H.positive(referencePressure);
    H.domain(partialPressure >= 0 && partialPressure <= totalPressure);
    return {
      mixingFraction: partialPressure / totalPressure,
      referencePartialPressure:
        (partialPressure / totalPressure) * referencePressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partialPressure: 2, totalPressure: 100, referencePressure: 80 },
  output: { mixingFraction: 0.02, referencePartialPressure: 1.6 },
} satisfies ToolExample<Input, Output>;
export const mixingRatioReferencePressureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/mixing-ratio-reference-pressure-factor",
    title: "Mixing Ratio Reference Pressure Factor Tool",
    description:
      "Rescale a supplied ideal-gas partial pressure at constant mole fraction without inferring atmospheric composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partialPressure: { type: "number", minimum: 0 },
        totalPressure: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["partialPressure", "totalPressure", "referencePressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mixingFraction: { type: "number" },
        referencePartialPressure: { type: "number" },
      },
      required: ["mixingFraction", "referencePartialPressure"],
    },
    ports: {
      inputs: [
        {
          id: "partialPressure",
          label: "Partial Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPressure",
          label: "Total Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mixingFraction",
          label: "Mixing Fraction",
          valueType: { type: "number" },
        },
        {
          id: "referencePartialPressure",
          label: "Reference Partial Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mixingRatioReferencePressureFactorTool.execute;
export default mixingRatioReferencePressureFactorTool;
