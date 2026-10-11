import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mapId: string;
  readonly pointId: string;
  readonly recordedRegion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapId: { type: "string", maxLength: 8192, minLength: 1 },
    pointId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedRegion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["mapId", "pointId", "recordedRegion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicitly identified joint-map point with supplied region wording without anatomical lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mapId, pointId, recordedRegion } = request;
  const compute = (): Output => {
    H.domain(mapId.length > 0, "mapId");
    H.domain(pointId.length > 0, "pointId");
    H.domain(recordedRegion.length > 0, "recordedRegion");
    return { token: JSON.stringify([mapId, pointId, recordedRegion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mapId: "MAP17", pointId: "P3", recordedRegion: "region A" },
  output: { token: '["MAP17","P3","region A"]' },
} satisfies ToolExample<Input, Output>;
export const jointMapPointRegionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/joint-map-point-region-label",
    title: "Joint Map Point Region Label",
    description:
      "Associate an explicitly identified joint-map point with supplied region wording without anatomical lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mapId: { type: "string", maxLength: 8192, minLength: 1 },
        pointId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedRegion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["mapId", "pointId", "recordedRegion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "mapId",
          label: "Map Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pointId",
          label: "Point Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedRegion",
          label: "Recorded Region",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = jointMapPointRegionLabelTool.execute;
export default jointMapPointRegionLabelTool;
