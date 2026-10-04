import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerLineCoordinate: number;
  readonly wallThickness: number;
  readonly side: number;
};
export type Output = { readonly faceCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerLineCoordinate: { type: "number" },
    wallThickness: { type: "number", minimum: 0 },
    side: { type: "integer" },
  },
  required: ["centerLineCoordinate", "wallThickness", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { faceCoordinate: { type: "number" } },
  required: ["faceCoordinate"],
} as const;
/** Locate a symmetric wall face from its centerline, thickness and explicit signed side along one coordinate axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerLineCoordinate, wallThickness, side } = request;
  const compute = (): Output => {
    H.domain(wallThickness >= 0, "wallThickness");
    H.domain(side === -1 || side === 1, "side");
    return {
      faceCoordinate: centerLineCoordinate + (side * wallThickness) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerLineCoordinate: 100, wallThickness: 20, side: 1 },
  output: { faceCoordinate: 110 },
} satisfies ToolExample<Input, Output>;
export const wallCenterLineToFaceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/wall-center-line-to-face-offset",
    title: "Wall Center Line To Face Offset Tool",
    description:
      "Locate a symmetric wall face from its centerline, thickness and explicit signed side along one coordinate axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerLineCoordinate: { type: "number" },
        wallThickness: { type: "number", minimum: 0 },
        side: { type: "integer" },
      },
      required: ["centerLineCoordinate", "wallThickness", "side"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { faceCoordinate: { type: "number" } },
      required: ["faceCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "centerLineCoordinate",
          label: "Center Line Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wallThickness",
          label: "Wall Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "faceCoordinate",
          label: "Face Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wallCenterLineToFaceOffsetTool.execute;
export default wallCenterLineToFaceOffsetTool;
