import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quadratArea: number;
  readonly sampledDepth: number;
};
export type Output = { readonly sampledVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadratArea: { type: "number", minimum: 0 },
    sampledDepth: { type: "number", minimum: 0 },
  },
  required: ["quadratArea", "sampledDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampledVolume: { type: "number" } },
  required: ["sampledVolume"],
} as const;
/** Multiply supplied quadrat area by sampled depth in compatible units to obtain represented soil volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quadratArea, sampledDepth } = request;
  const compute = (): Output => {
    H.domain(quadratArea >= 0, "quadratArea");
    H.domain(sampledDepth >= 0, "sampledDepth");
    return { sampledVolume: quadratArea * sampledDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quadratArea: 0.25, sampledDepth: 0.2 },
  output: { sampledVolume: 0.05 },
} satisfies ToolExample<Input, Output>;
export const soilBiotaQuadratVolumeReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/soil-biota-quadrat-volume-reference",
    title: "Soil Biota Quadrat Volume Reference",
    description:
      "Multiply supplied quadrat area by sampled depth in compatible units to obtain represented soil volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadratArea: { type: "number", minimum: 0 },
        sampledDepth: { type: "number", minimum: 0 },
      },
      required: ["quadratArea", "sampledDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sampledVolume: { type: "number" } },
      required: ["sampledVolume"],
    },
    ports: {
      inputs: [
        {
          id: "quadratArea",
          label: "Quadrat Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledDepth",
          label: "Sampled Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilBiotaQuadratVolumeReferenceTool.execute;
export default soilBiotaQuadratVolumeReferenceTool;
