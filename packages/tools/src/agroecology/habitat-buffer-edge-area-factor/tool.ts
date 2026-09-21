import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgeLength: number;
  readonly bufferWidth: number;
  readonly cornerCorrection: number;
};
export type Output = {
  readonly nominalArea: number;
  readonly correctedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeLength: { type: "number", minimum: 0 },
    bufferWidth: { type: "number", minimum: 0 },
    cornerCorrection: { type: "number" },
  },
  required: ["edgeLength", "bufferWidth", "cornerCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalArea: { type: "number" },
    correctedArea: { type: "number" },
  },
  required: ["nominalArea", "correctedArea"],
} as const;
/** Strip area with a supplied signed corner correction, without inferring habitat geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeLength, bufferWidth, cornerCorrection } = request;
  const compute = (): Output => {
    H.domain(edgeLength >= 0 && bufferWidth >= 0);
    return {
      nominalArea: edgeLength * bufferWidth,
      correctedArea: edgeLength * bufferWidth + cornerCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeLength: 100, bufferWidth: 2, cornerCorrection: 5 },
  output: { nominalArea: 200, correctedArea: 205 },
} satisfies ToolExample<Input, Output>;
export const habitatBufferEdgeAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/habitat-buffer-edge-area-factor",
    title: "Habitat Buffer Edge Area Factor Tool",
    description:
      "Strip area with a supplied signed corner correction, without inferring habitat geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeLength: { type: "number", minimum: 0 },
        bufferWidth: { type: "number", minimum: 0 },
        cornerCorrection: { type: "number" },
      },
      required: ["edgeLength", "bufferWidth", "cornerCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalArea: { type: "number" },
        correctedArea: { type: "number" },
      },
      required: ["nominalArea", "correctedArea"],
    },
    ports: {
      inputs: [
        {
          id: "edgeLength",
          label: "Edge Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferWidth",
          label: "Buffer Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cornerCorrection",
          label: "Corner Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalArea",
          label: "Nominal Area",
          valueType: { type: "number" },
        },
        {
          id: "correctedArea",
          label: "Corrected Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitatBufferEdgeAreaFactorTool.execute;
export default habitatBufferEdgeAreaFactorTool;
