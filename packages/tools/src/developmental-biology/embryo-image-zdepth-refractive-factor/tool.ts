import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDepth: number;
  readonly sampleIndex: number;
  readonly immersionIndex: number;
};
export type Output = {
  readonly correctedDepth: number;
  readonly scaleFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDepth: { type: "number", minimum: 0 },
    sampleIndex: { type: "number", exclusiveMinimum: 0 },
    immersionIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredDepth", "sampleIndex", "immersionIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedDepth: { type: "number" },
    scaleFactor: { type: "number" },
  },
  required: ["correctedDepth", "scaleFactor"],
} as const;
/** Paraxial axial refractive-index scaling, excluding high-NA aberration and instrument-specific calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredDepth, sampleIndex, immersionIndex } = request;
  const compute = (): Output => {
    H.domain(measuredDepth >= 0);
    H.positive(sampleIndex);
    H.positive(immersionIndex);
    return {
      correctedDepth: (measuredDepth * sampleIndex) / immersionIndex,
      scaleFactor: sampleIndex / immersionIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredDepth: 10, sampleIndex: 1.5, immersionIndex: 1 },
  output: { correctedDepth: 15, scaleFactor: 1.5 },
} satisfies ToolExample<Input, Output>;
export const embryoImageZdepthRefractiveFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryo-image-zdepth-refractive-factor",
    title: "Embryo Image Zdepth Refractive Factor Tool",
    description:
      "Paraxial axial refractive-index scaling, excluding high-NA aberration and instrument-specific calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredDepth: { type: "number", minimum: 0 },
        sampleIndex: { type: "number", exclusiveMinimum: 0 },
        immersionIndex: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredDepth", "sampleIndex", "immersionIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedDepth: { type: "number" },
        scaleFactor: { type: "number" },
      },
      required: ["correctedDepth", "scaleFactor"],
    },
    ports: {
      inputs: [
        {
          id: "measuredDepth",
          label: "Measured Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "immersionIndex",
          label: "Immersion Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedDepth",
          label: "Corrected Depth",
          valueType: { type: "number" },
        },
        {
          id: "scaleFactor",
          label: "Scale Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = embryoImageZdepthRefractiveFactorTool.execute;
export default embryoImageZdepthRefractiveFactorTool;
