import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planArea: number;
  readonly layerDepth: number;
  readonly suppliedVoidFraction: number;
};
export type Output = {
  readonly grossLayerVolume: number;
  readonly voidVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planArea: { type: "number", minimum: 0 },
    layerDepth: { type: "number", minimum: 0 },
    suppliedVoidFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["planArea", "layerDepth", "suppliedVoidFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLayerVolume: { type: "number" },
    voidVolume: { type: "number" },
  },
  required: ["grossLayerVolume", "voidVolume"],
} as const;
/** Calculate explicit uniform drainage-layer gross and void volumes without predicting drainage performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { planArea, layerDepth, suppliedVoidFraction } = request;
  const compute = (): Output => {
    H.domain(planArea >= 0 && layerDepth >= 0, "planArea");
    (H.domain(
      suppliedVoidFraction >= 0 && suppliedVoidFraction <= 1,
      "suppliedVoidFraction",
    ),
      suppliedVoidFraction);
    return {
      grossLayerVolume: planArea * layerDepth,
      voidVolume: planArea * layerDepth * suppliedVoidFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { planArea: 2, layerDepth: 0.2, suppliedVoidFraction: 0.5 },
  output: { grossLayerVolume: 0.4, voidVolume: 0.2 },
} satisfies ToolExample<Input, Output>;
export const planterFreeDrainageLayerVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/planter-free-drainage-layer-volume",
    title: "Planter Free Drainage Layer Volume",
    description:
      "Calculate explicit uniform drainage-layer gross and void volumes without predicting drainage performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planArea: { type: "number", minimum: 0 },
        layerDepth: { type: "number", minimum: 0 },
        suppliedVoidFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["planArea", "layerDepth", "suppliedVoidFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossLayerVolume: { type: "number" },
        voidVolume: { type: "number" },
      },
      required: ["grossLayerVolume", "voidVolume"],
    },
    ports: {
      inputs: [
        {
          id: "planArea",
          label: "Plan Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "layerDepth",
          label: "Layer Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVoidFraction",
          label: "Supplied Void Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossLayerVolume",
          label: "Gross Layer Volume",
          valueType: { type: "number" },
        },
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = planterFreeDrainageLayerVolumeTool.execute;
export default planterFreeDrainageLayerVolumeTool;
