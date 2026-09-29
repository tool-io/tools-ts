import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tileWidth: number;
  readonly tileHeight: number;
  readonly columns: number;
  readonly rows: number;
  readonly overlapX: number;
  readonly overlapY: number;
};
export type Output = {
  readonly mosaicWidth: number;
  readonly mosaicHeight: number;
  readonly pixelsSaved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tileWidth: { type: "integer", minimum: 1 },
    tileHeight: { type: "integer", minimum: 1 },
    columns: { type: "integer", minimum: 1 },
    rows: { type: "integer", minimum: 1 },
    overlapX: { type: "integer", minimum: 0 },
    overlapY: { type: "integer", minimum: 0 },
  },
  required: [
    "tileWidth",
    "tileHeight",
    "columns",
    "rows",
    "overlapX",
    "overlapY",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mosaicWidth: { type: "integer" },
    mosaicHeight: { type: "integer" },
    pixelsSaved: { type: "number" },
  },
  required: ["mosaicWidth", "mosaicHeight", "pixelsSaved"],
} as const;
/** Regular rectangular tile mosaic dimensions with fixed overlaps, without image registration or tissue segmentation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tileWidth, tileHeight, columns, rows, overlapX, overlapY } = request;
  const compute = (): Output => {
    H.integer(tileWidth, 1);
    H.integer(tileHeight, 1);
    H.integer(columns, 1);
    H.integer(rows, 1);
    H.integer(overlapX, 0, tileWidth - 1);
    H.integer(overlapY, 0, tileHeight - 1);
    return {
      mosaicWidth: columns * tileWidth - (columns - 1) * overlapX,
      mosaicHeight: rows * tileHeight - (rows - 1) * overlapY,
      pixelsSaved:
        columns * rows * tileWidth * tileHeight -
        (columns * tileWidth - (columns - 1) * overlapX) *
          (rows * tileHeight - (rows - 1) * overlapY),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tileWidth: 100,
    tileHeight: 80,
    columns: 3,
    rows: 2,
    overlapX: 10,
    overlapY: 20,
  },
  output: { mosaicWidth: 280, mosaicHeight: 140, pixelsSaved: 8800 },
} satisfies ToolExample<Input, Output>;
export const wholeSlideTileOverlapPixelBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/whole-slide-tile-overlap-pixel-budget",
    title: "Whole Slide Tile Overlap Pixel Budget Tool",
    description:
      "Regular rectangular tile mosaic dimensions with fixed overlaps, without image registration or tissue segmentation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tileWidth: { type: "integer", minimum: 1 },
        tileHeight: { type: "integer", minimum: 1 },
        columns: { type: "integer", minimum: 1 },
        rows: { type: "integer", minimum: 1 },
        overlapX: { type: "integer", minimum: 0 },
        overlapY: { type: "integer", minimum: 0 },
      },
      required: [
        "tileWidth",
        "tileHeight",
        "columns",
        "rows",
        "overlapX",
        "overlapY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mosaicWidth: { type: "integer" },
        mosaicHeight: { type: "integer" },
        pixelsSaved: { type: "number" },
      },
      required: ["mosaicWidth", "mosaicHeight", "pixelsSaved"],
    },
    ports: {
      inputs: [
        {
          id: "tileWidth",
          label: "Tile Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tileHeight",
          label: "Tile Height",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columns",
          label: "Columns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlapX",
          label: "Overlap X",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlapY",
          label: "Overlap Y",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "mosaicWidth",
          label: "Mosaic Width",
          valueType: { type: "integer" },
        },
        {
          id: "mosaicHeight",
          label: "Mosaic Height",
          valueType: { type: "integer" },
        },
        {
          id: "pixelsSaved",
          label: "Pixels Saved",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wholeSlideTileOverlapPixelBudgetTool.execute;
export default wholeSlideTileOverlapPixelBudgetTool;
