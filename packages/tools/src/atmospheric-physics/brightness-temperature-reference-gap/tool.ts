import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredKelvin: number;
  readonly referenceKelvin: number;
};
export type Output = {
  readonly gapKelvin: number;
  readonly relativeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredKelvin: { type: "number", minimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredKelvin", "referenceKelvin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapKelvin: { type: "number" },
    relativeGap: { type: "number" },
  },
  required: ["gapKelvin", "relativeGap"],
} as const;
/** Compare supplied brightness temperatures without deriving them from spectral radiance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredKelvin, referenceKelvin } = request;
  const compute = (): Output => {
    H.domain(measuredKelvin >= 0);
    H.positive(referenceKelvin);
    return {
      gapKelvin: measuredKelvin - referenceKelvin,
      relativeGap: (measuredKelvin - referenceKelvin) / referenceKelvin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredKelvin: 300, referenceKelvin: 250 },
  output: { gapKelvin: 50, relativeGap: 0.2 },
} satisfies ToolExample<Input, Output>;
export const brightnessTemperatureReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/brightness-temperature-reference-gap",
    title: "Brightness Temperature Reference Gap Tool",
    description:
      "Compare supplied brightness temperatures without deriving them from spectral radiance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredKelvin: { type: "number", minimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredKelvin", "referenceKelvin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapKelvin: { type: "number" },
        relativeGap: { type: "number" },
      },
      required: ["gapKelvin", "relativeGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredKelvin",
          label: "Measured Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gapKelvin", label: "Gap Kelvin", valueType: { type: "number" } },
        {
          id: "relativeGap",
          label: "Relative Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = brightnessTemperatureReferenceGapTool.execute;
export default brightnessTemperatureReferenceGapTool;
