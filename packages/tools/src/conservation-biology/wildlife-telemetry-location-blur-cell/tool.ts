import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly gridWidth: number;
  readonly gridOrigin: number;
};
export type Output = {
  readonly cellIndex: number;
  readonly publicCellMidpoint: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    gridWidth: { type: "number", exclusiveMinimum: 0 },
    gridOrigin: { type: "number" },
  },
  required: ["coordinate", "gridWidth", "gridOrigin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellIndex: { type: "integer" },
    publicCellMidpoint: { type: "number" },
  },
  required: ["cellIndex", "publicCellMidpoint"],
} as const;
/** Map one supplied telemetry coordinate to an explicit grid-cell midpoint without promising location anonymity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, gridWidth, gridOrigin } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(gridWidth) && gridWidth > 0, "gridWidth"),
      gridWidth);
    return (() => {
      const cellIndex = Math.floor((coordinate - gridOrigin) / gridWidth);
      return {
        cellIndex,
        publicCellMidpoint: gridOrigin + (cellIndex + 0.5) * gridWidth,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 12, gridWidth: 10, gridOrigin: 0 },
  output: { cellIndex: 1, publicCellMidpoint: 15 },
} satisfies ToolExample<Input, Output>;
export const wildlifeTelemetryLocationBlurCellTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/wildlife-telemetry-location-blur-cell",
    title: "Wildlife Telemetry Location Blur Cell",
    description:
      "Map one supplied telemetry coordinate to an explicit grid-cell midpoint without promising location anonymity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        gridWidth: { type: "number", exclusiveMinimum: 0 },
        gridOrigin: { type: "number" },
      },
      required: ["coordinate", "gridWidth", "gridOrigin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellIndex: { type: "integer" },
        publicCellMidpoint: { type: "number" },
      },
      required: ["cellIndex", "publicCellMidpoint"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridWidth",
          label: "Grid Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridOrigin",
          label: "Grid Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cellIndex",
          label: "Cell Index",
          valueType: { type: "integer" },
        },
        {
          id: "publicCellMidpoint",
          label: "Public Cell Midpoint",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wildlifeTelemetryLocationBlurCellTool.execute;
export default wildlifeTelemetryLocationBlurCellTool;
