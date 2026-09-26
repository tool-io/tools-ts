import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly east: number;
  readonly north: number;
  readonly gridSize: number;
  readonly originEast: number;
  readonly originNorth: number;
};
export type Output = {
  readonly maskedEast: number;
  readonly maskedNorth: number;
  readonly cellEast: number;
  readonly cellNorth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    east: { type: "number" },
    north: { type: "number" },
    gridSize: { type: "number", exclusiveMinimum: 0 },
    originEast: { type: "number" },
    originNorth: { type: "number" },
  },
  required: ["east", "north", "gridSize", "originEast", "originNorth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maskedEast: { type: "number" },
    maskedNorth: { type: "number" },
    cellEast: { type: "integer" },
    cellNorth: { type: "integer" },
  },
  required: ["maskedEast", "maskedNorth", "cellEast", "cellNorth"],
} as const;
/** Snap projected coordinates to an explicit grid-cell center; this deterministic coarsening does not guarantee locality confidentiality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { east, north, gridSize, originEast, originNorth } = request;
  const compute = (): Output => {
    H.positive(gridSize);
    return {
      maskedEast:
        originEast +
        (Math.floor((east - originEast) / gridSize) + 0.5) * gridSize,
      maskedNorth:
        originNorth +
        (Math.floor((north - originNorth) / gridSize) + 0.5) * gridSize,
      cellEast: Math.floor((east - originEast) / gridSize),
      cellNorth: Math.floor((north - originNorth) / gridSize),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    east: 123,
    north: 278,
    gridSize: 100,
    originEast: 0,
    originNorth: 0,
  },
  output: { maskedEast: 150, maskedNorth: 250, cellEast: 1, cellNorth: 2 },
} satisfies ToolExample<Input, Output>;
export const publicVoucherLocalityGridMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/public-voucher-locality-grid-mask",
    title: "Public Voucher Locality Grid Mask Tool",
    description:
      "Snap projected coordinates to an explicit grid-cell center; this deterministic coarsening does not guarantee locality confidentiality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        east: { type: "number" },
        north: { type: "number" },
        gridSize: { type: "number", exclusiveMinimum: 0 },
        originEast: { type: "number" },
        originNorth: { type: "number" },
      },
      required: ["east", "north", "gridSize", "originEast", "originNorth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maskedEast: { type: "number" },
        maskedNorth: { type: "number" },
        cellEast: { type: "integer" },
        cellNorth: { type: "integer" },
      },
      required: ["maskedEast", "maskedNorth", "cellEast", "cellNorth"],
    },
    ports: {
      inputs: [
        {
          id: "east",
          label: "East",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "north",
          label: "North",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridSize",
          label: "Grid Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originEast",
          label: "Origin East",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originNorth",
          label: "Origin North",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "maskedEast",
          label: "Masked East",
          valueType: { type: "number" },
        },
        {
          id: "maskedNorth",
          label: "Masked North",
          valueType: { type: "number" },
        },
        { id: "cellEast", label: "Cell East", valueType: { type: "integer" } },
        {
          id: "cellNorth",
          label: "Cell North",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicVoucherLocalityGridMaskTool.execute;
export default publicVoucherLocalityGridMaskTool;
