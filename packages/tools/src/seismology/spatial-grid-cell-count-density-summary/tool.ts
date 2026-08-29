import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const spatialGridCellCountDensitySummaryExample = {
  input: {
    eastingsKm: [0.5, 0.9, 2.1],
    northingsKm: [0.5, 0.8, 0.1],
    cellSizeKm: 1,
  },
  output: { occupiedCells: 2, maxCountPerCell: 2, eventsPerOccupiedCell: 1.5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const spatialGridCellCountDensitySummaryTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eastingsKm, northingsKm, cellSizeKm }) => {
      const xs = eastingsKm as unknown[];
      const ys = northingsKm as unknown[];
      if (
        !Array.isArray(xs) ||
        !Array.isArray(ys) ||
        xs.length !== ys.length ||
        xs.length === 0
      )
        simpleError(
          "eastingsKm",
          "Provide matching non-empty coordinate lists.",
        );
      if (cellSizeKm <= 0)
        simpleError("cellSizeKm", "Cell size must be positive.");
      const counts = new Map();
      const X = xs as number[];
      const Y = ys as number[];
      for (let i = 0; i < X.length; i++) {
        const key = `${Math.floor(X[i] / cellSizeKm)}:${Math.floor(Y[i] / cellSizeKm)}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      let maxC = 0;
      for (const v of counts.values()) maxC = Math.max(maxC, v);
      return {
        occupiedCells: counts.size,
        maxCountPerCell: maxC,
        eventsPerOccupiedCell: X.length / counts.size,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Bin event eastings/northings into a square grid and report cell occupancy statistics.",
  id: "seismology/spatial-grid-cell-count-density-summary",
  inputs: [
    {
      description: "Event eastings.",
      id: "eastingsKm",
      kind: "numberList",
      label: "x_i",
    },
    {
      description: "Event northings.",
      id: "northingsKm",
      kind: "numberList",
      label: "y_i",
    },
    {
      minimum: 0,
      description: "Square cell edge.",
      id: "cellSizeKm",
      kind: "number",
      label: "a",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Number of distinct occupied cells.",
      id: "occupiedCells",
      kind: "integer",
      label: "cells",
    },
    {
      description: "Highest count in any cell.",
      id: "maxCountPerCell",
      kind: "integer",
      label: "max",
    },
    {
      description: "Mean events per occupied cell.",
      id: "eventsPerOccupiedCell",
      kind: "number",
      label: "N/cell",
    },
  ],
  title: "Spatial Grid Cell Count Density Summary",
});
export const runSpatialGridCellCountDensitySummary =
  spatialGridCellCountDensitySummaryTool.execute;
export { spatialGridCellCountDensitySummaryExample as example };
export default spatialGridCellCountDensitySummaryTool;
