import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomArea: number;
  readonly topArea: number;
  readonly depth: number;
};
export type Output = { readonly volume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomArea: { type: "number", minimum: 0 },
    topArea: { type: "number" },
    depth: { type: "number", minimum: 0 },
  },
  required: ["bottomArea", "topArea", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" } },
  required: ["volume"],
} as const;
/** Similar horizontal sections form a pyramidal frustum; other basin shapes require a different volume model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bottomArea, topArea, depth } = request;
  const compute = (): Output => {
    H.domain(bottomArea >= 0 && topArea >= bottomArea && depth >= 0);
    return {
      volume:
        (depth * (bottomArea + topArea + Math.sqrt(bottomArea * topArea))) / 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bottomArea: 4, topArea: 16, depth: 3 },
  output: { volume: 28 },
} satisfies ToolExample<Input, Output>;
export const rainGardenPondingVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/rain-garden-ponding-volume-term",
    title: "Rain Garden Ponding Volume Term Tool",
    description:
      "Similar horizontal sections form a pyramidal frustum; other basin shapes require a different volume model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomArea: { type: "number", minimum: 0 },
        topArea: { type: "number" },
        depth: { type: "number", minimum: 0 },
      },
      required: ["bottomArea", "topArea", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" } },
      required: ["volume"],
    },
    ports: {
      inputs: [
        {
          id: "bottomArea",
          label: "Bottom Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topArea",
          label: "Top Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rainGardenPondingVolumeTermTool.execute;
export default rainGardenPondingVolumeTermTool;
