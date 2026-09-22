import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integratedSignal: number;
  readonly bandwidth: number;
  readonly referenceBandwidth: number;
};
export type Output = {
  readonly perUnitBandwidth: number;
  readonly referenceSignal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integratedSignal: { type: "number" },
    bandwidth: { type: "number", exclusiveMinimum: 0 },
    referenceBandwidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["integratedSignal", "bandwidth", "referenceBandwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perUnitBandwidth: { type: "number" },
    referenceSignal: { type: "number" },
  },
  required: ["perUnitBandwidth", "referenceSignal"],
} as const;
/** Uniform spectral-density normalization under a caller-asserted flat-band approximation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integratedSignal, bandwidth, referenceBandwidth } = request;
  const compute = (): Output => {
    H.positive(bandwidth);
    H.positive(referenceBandwidth);
    return {
      perUnitBandwidth: integratedSignal / bandwidth,
      referenceSignal: (integratedSignal * referenceBandwidth) / bandwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integratedSignal: 20, bandwidth: 5, referenceBandwidth: 2 },
  output: { perUnitBandwidth: 4, referenceSignal: 8 },
} satisfies ToolExample<Input, Output>;
export const radiometerBandwidthNormalizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radiometer-bandwidth-normalization",
    title: "Radiometer Bandwidth Normalization Tool",
    description:
      "Uniform spectral-density normalization under a caller-asserted flat-band approximation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integratedSignal: { type: "number" },
        bandwidth: { type: "number", exclusiveMinimum: 0 },
        referenceBandwidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["integratedSignal", "bandwidth", "referenceBandwidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perUnitBandwidth: { type: "number" },
        referenceSignal: { type: "number" },
      },
      required: ["perUnitBandwidth", "referenceSignal"],
    },
    ports: {
      inputs: [
        {
          id: "integratedSignal",
          label: "Integrated Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bandwidth",
          label: "Bandwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceBandwidth",
          label: "Reference Bandwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "perUnitBandwidth",
          label: "Per Unit Bandwidth",
          valueType: { type: "number" },
        },
        {
          id: "referenceSignal",
          label: "Reference Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radiometerBandwidthNormalizationTool.execute;
export default radiometerBandwidthNormalizationTool;
