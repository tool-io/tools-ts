import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spectralRadiance: number;
  readonly binWidth: number;
  readonly suppliedSpectralUnitFactor: number;
};
export type Output = { readonly integratedEquivalent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spectralRadiance: { type: "number" },
    binWidth: { type: "number", minimum: 0 },
    suppliedSpectralUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spectralRadiance", "binWidth", "suppliedSpectralUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integratedEquivalent: { type: "number" } },
  required: ["integratedEquivalent"],
} as const;
/** Constant-bin supplied spectral radiance integral with an explicit compatible spectral-axis factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spectralRadiance, binWidth, suppliedSpectralUnitFactor } = request;
  const compute = (): Output => {
    H.domain(binWidth >= 0);
    H.positive(suppliedSpectralUnitFactor);
    return {
      integratedEquivalent:
        spectralRadiance * binWidth * suppliedSpectralUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spectralRadiance: 2, binWidth: 5, suppliedSpectralUnitFactor: 0.1 },
  output: { integratedEquivalent: 1 },
} satisfies ToolExample<Input, Output>;
export const radianceBinWidthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radiance-bin-width-factor",
    title: "Radiance Bin Width Factor Tool",
    description:
      "Constant-bin supplied spectral radiance integral with an explicit compatible spectral-axis factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spectralRadiance: { type: "number" },
        binWidth: { type: "number", minimum: 0 },
        suppliedSpectralUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spectralRadiance", "binWidth", "suppliedSpectralUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integratedEquivalent: { type: "number" } },
      required: ["integratedEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "spectralRadiance",
          label: "Spectral Radiance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binWidth",
          label: "Bin Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSpectralUnitFactor",
          label: "Supplied Spectral Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "integratedEquivalent",
          label: "Integrated Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radianceBinWidthFactorTool.execute;
export default radianceBinWidthFactorTool;
