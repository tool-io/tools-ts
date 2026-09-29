import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freeDiameter: number;
  readonly clampedDiameter: number;
};
export type Output = {
  readonly diameterReduction: number;
  readonly reductionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeDiameter: { type: "number", exclusiveMinimum: 0 },
    clampedDiameter: { type: "number", minimum: 0 },
  },
  required: ["freeDiameter", "clampedDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameterReduction: { type: "number" },
    reductionFraction: { type: "number" },
  },
  required: ["diameterReduction", "reductionFraction"],
} as const;
/** Calculate cable strain relief clamp compression from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freeDiameter, clampedDiameter } = request;
  const compute = (): Output => {
    H.positive(freeDiameter);
    H.domain(clampedDiameter >= 0);
    return {
      diameterReduction: freeDiameter - clampedDiameter,
      reductionFraction: (freeDiameter - clampedDiameter) / freeDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freeDiameter: 10, clampedDiameter: 8 },
  output: { diameterReduction: 2, reductionFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const cableStrainReliefClampCompressionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/cable-strain-relief-clamp-compression",
    title: "Cable Strain Relief Clamp Compression Tool",
    description:
      "Calculate cable strain relief clamp compression from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        freeDiameter: { type: "number", exclusiveMinimum: 0 },
        clampedDiameter: { type: "number", minimum: 0 },
      },
      required: ["freeDiameter", "clampedDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameterReduction: { type: "number" },
        reductionFraction: { type: "number" },
      },
      required: ["diameterReduction", "reductionFraction"],
    },
    ports: {
      inputs: [
        {
          id: "freeDiameter",
          label: "Free Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clampedDiameter",
          label: "Clamped Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diameterReduction",
          label: "Diameter Reduction",
          valueType: { type: "number" },
        },
        {
          id: "reductionFraction",
          label: "Reduction Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cableStrainReliefClampCompressionTool.execute;
export default cableStrainReliefClampCompressionTool;
