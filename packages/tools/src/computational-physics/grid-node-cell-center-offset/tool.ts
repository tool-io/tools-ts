import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly origin: number;
  readonly cellWidth: number;
  readonly zeroBasedCellIndex: number;
};
export type Output = {
  readonly cellCenter: number;
  readonly leftNode: number;
  readonly rightNode: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    origin: { type: "number" },
    cellWidth: { type: "number", exclusiveMinimum: 0 },
    zeroBasedCellIndex: { type: "integer", minimum: 0 },
  },
  required: ["origin", "cellWidth", "zeroBasedCellIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellCenter: { type: "number" },
    leftNode: { type: "number" },
    rightNode: { type: "number" },
  },
  required: ["cellCenter", "leftNode", "rightNode"],
} as const;
/** Locate one uniform-grid cell center and bounding nodes from an explicit origin and zero-based index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { origin, cellWidth, zeroBasedCellIndex } = request;
  const compute = (): Output => {
    (H.domain(cellWidth > 0, "cellWidth"), cellWidth);
    (H.domain(
      Number.isSafeInteger(zeroBasedCellIndex) &&
        zeroBasedCellIndex >= 0 &&
        zeroBasedCellIndex <= Number.MAX_SAFE_INTEGER,
      "zeroBasedCellIndex",
    ),
      zeroBasedCellIndex);
    return {
      cellCenter: origin + (zeroBasedCellIndex + 0.5) * cellWidth,
      leftNode: origin + zeroBasedCellIndex * cellWidth,
      rightNode: origin + (zeroBasedCellIndex + 1) * cellWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { origin: 0, cellWidth: 2, zeroBasedCellIndex: 3 },
  output: { cellCenter: 7, leftNode: 6, rightNode: 8 },
} satisfies ToolExample<Input, Output>;
export const gridNodeCellCenterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/grid-node-cell-center-offset",
    title: "Grid Node Cell Center Offset",
    description:
      "Locate one uniform-grid cell center and bounding nodes from an explicit origin and zero-based index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        origin: { type: "number" },
        cellWidth: { type: "number", exclusiveMinimum: 0 },
        zeroBasedCellIndex: { type: "integer", minimum: 0 },
      },
      required: ["origin", "cellWidth", "zeroBasedCellIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellCenter: { type: "number" },
        leftNode: { type: "number" },
        rightNode: { type: "number" },
      },
      required: ["cellCenter", "leftNode", "rightNode"],
    },
    ports: {
      inputs: [
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellWidth",
          label: "Cell Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroBasedCellIndex",
          label: "Zero Based Cell Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cellCenter",
          label: "Cell Center",
          valueType: { type: "number" },
        },
        { id: "leftNode", label: "Left Node", valueType: { type: "number" } },
        { id: "rightNode", label: "Right Node", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gridNodeCellCenterOffsetTool.execute;
export default gridNodeCellCenterOffsetTool;
