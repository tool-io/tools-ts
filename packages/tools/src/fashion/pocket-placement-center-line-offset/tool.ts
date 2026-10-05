import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly garmentCenterCoordinate: number;
  readonly pocketCenterCoordinate: number;
  readonly pocketWidth: number;
};
export type Output = {
  readonly centerOffset: number;
  readonly innerEdgeCoordinate: number;
  readonly outerEdgeCoordinate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    garmentCenterCoordinate: { type: "number" },
    pocketCenterCoordinate: { type: "number" },
    pocketWidth: { type: "number", minimum: 0 },
  },
  required: [
    "garmentCenterCoordinate",
    "pocketCenterCoordinate",
    "pocketWidth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerOffset: { type: "number" },
    innerEdgeCoordinate: { type: "number" },
    outerEdgeCoordinate: { type: "number" },
  },
  required: ["centerOffset", "innerEdgeCoordinate", "outerEdgeCoordinate"],
} as const;
/** Locate pocket center and its negative/positive axis edges relative to a garment centerline in one shared coordinate frame. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { garmentCenterCoordinate, pocketCenterCoordinate, pocketWidth } =
    request;
  const compute = (): Output => {
    H.domain(pocketWidth >= 0, "pocketWidth");
    return {
      centerOffset: pocketCenterCoordinate - garmentCenterCoordinate,
      innerEdgeCoordinate: pocketCenterCoordinate - pocketWidth / 2,
      outerEdgeCoordinate: pocketCenterCoordinate + pocketWidth / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    garmentCenterCoordinate: 0,
    pocketCenterCoordinate: 12,
    pocketWidth: 10,
  },
  output: { centerOffset: 12, innerEdgeCoordinate: 7, outerEdgeCoordinate: 17 },
} satisfies ToolExample<Input, Output>;
export const pocketPlacementCenterLineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pocket-placement-center-line-offset",
    title: "Pocket Placement Center Line Offset Tool",
    description:
      "Locate pocket center and its negative/positive axis edges relative to a garment centerline in one shared coordinate frame.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        garmentCenterCoordinate: { type: "number" },
        pocketCenterCoordinate: { type: "number" },
        pocketWidth: { type: "number", minimum: 0 },
      },
      required: [
        "garmentCenterCoordinate",
        "pocketCenterCoordinate",
        "pocketWidth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerOffset: { type: "number" },
        innerEdgeCoordinate: { type: "number" },
        outerEdgeCoordinate: { type: "number" },
      },
      required: ["centerOffset", "innerEdgeCoordinate", "outerEdgeCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "garmentCenterCoordinate",
          label: "Garment Center Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pocketCenterCoordinate",
          label: "Pocket Center Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pocketWidth",
          label: "Pocket Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centerOffset",
          label: "Center Offset",
          valueType: { type: "number" },
        },
        {
          id: "innerEdgeCoordinate",
          label: "Inner Edge Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "outerEdgeCoordinate",
          label: "Outer Edge Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pocketPlacementCenterLineOffsetTool.execute;
export default pocketPlacementCenterLineOffsetTool;
