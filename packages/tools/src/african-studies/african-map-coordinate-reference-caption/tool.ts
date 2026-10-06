import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mapId: string;
  readonly suppliedCoordinateCaption: string;
  readonly referenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCoordinateCaption: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
    referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["mapId", "suppliedCoordinateCaption", "referenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit map coordinate-reference caption and source without assigning a coordinate system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mapId, suppliedCoordinateCaption, referenceSource } = request;
  const compute = (): Output => {
    H.domain(mapId.length > 0, "mapId");
    H.domain(suppliedCoordinateCaption.length > 0, "suppliedCoordinateCaption");
    H.domain(referenceSource.length > 0, "referenceSource");
    return {
      token: JSON.stringify([
        mapId,
        suppliedCoordinateCaption,
        referenceSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mapId: "MAP17",
    suppliedCoordinateCaption: "Grid A",
    referenceSource: "Catalogue A",
  },
  output: { token: '["MAP17","Grid A","Catalogue A"]' },
} satisfies ToolExample<Input, Output>;
export const africanMapCoordinateReferenceCaptionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-map-coordinate-reference-caption",
      title: "African Map Coordinate Reference Caption",
      description:
        "Preserve an explicit map coordinate-reference caption and source without assigning a coordinate system.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mapId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCoordinateCaption: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["mapId", "suppliedCoordinateCaption", "referenceSource"],
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
            id: "suppliedCoordinateCaption",
            label: "Supplied Coordinate Caption",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceSource",
            label: "Reference Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = africanMapCoordinateReferenceCaptionTool.execute;
export default africanMapCoordinateReferenceCaptionTool;
