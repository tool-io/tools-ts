import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerTop: number;
  readonly layerBottom: number;
  readonly sampleTop: number;
  readonly sampleBottom: number;
};
export type Output = {
  readonly layerThickness: number;
  readonly sampledThickness: number;
  readonly sampledFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerTop: { type: "number" },
    layerBottom: { type: "number" },
    sampleTop: { type: "number" },
    sampleBottom: { type: "number" },
  },
  required: ["layerTop", "layerBottom", "sampleTop", "sampleBottom"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerThickness: { type: "number" },
    sampledThickness: { type: "number" },
    sampledFraction: { type: "number" },
  },
  required: ["layerThickness", "sampledThickness", "sampledFraction"],
} as const;
/** Intersect supplied positive-down depth intervals; no water-layer model is estimated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerTop, layerBottom, sampleTop, sampleBottom } = request;
  const compute = (): Output => {
    H.domain(layerBottom > layerTop && sampleBottom >= sampleTop);
    return (() => {
      const layerThickness = layerBottom - layerTop,
        sampledThickness = Math.max(
          0,
          Math.min(layerBottom, sampleBottom) - Math.max(layerTop, sampleTop),
        );
      return {
        layerThickness,
        sampledThickness,
        sampledFraction: sampledThickness / layerThickness,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { layerTop: 0, layerBottom: 10, sampleTop: 4, sampleBottom: 15 },
  output: { layerThickness: 10, sampledThickness: 6, sampledFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const waterLayerSamplingThicknessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/water-layer-sampling-thickness",
    title: "Water Layer Sampling Thickness Tool",
    description:
      "Intersect supplied positive-down depth intervals; no water-layer model is estimated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerTop: { type: "number" },
        layerBottom: { type: "number" },
        sampleTop: { type: "number" },
        sampleBottom: { type: "number" },
      },
      required: ["layerTop", "layerBottom", "sampleTop", "sampleBottom"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerThickness: { type: "number" },
        sampledThickness: { type: "number" },
        sampledFraction: { type: "number" },
      },
      required: ["layerThickness", "sampledThickness", "sampledFraction"],
    },
    ports: {
      inputs: [
        {
          id: "layerTop",
          label: "Layer Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerBottom",
          label: "Layer Bottom",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleTop",
          label: "Sample Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleBottom",
          label: "Sample Bottom",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "layerThickness",
          label: "Layer Thickness",
          valueType: { type: "number" },
        },
        {
          id: "sampledThickness",
          label: "Sampled Thickness",
          valueType: { type: "number" },
        },
        {
          id: "sampledFraction",
          label: "Sampled Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterLayerSamplingThicknessTool.execute;
export default waterLayerSamplingThicknessTool;
