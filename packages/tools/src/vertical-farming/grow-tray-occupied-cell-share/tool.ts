import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupiedCells: number;
  readonly totalCells: number;
};
export type Output = {
  readonly occupiedFraction: number;
  readonly emptyCells: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedCells: { type: "integer", minimum: 0 },
    totalCells: { type: "integer", minimum: 1 },
  },
  required: ["occupiedCells", "totalCells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedFraction: { type: "number" },
    emptyCells: { type: "integer" },
  },
  required: ["occupiedFraction", "emptyCells"],
} as const;
/** Normalize an explicit occupied-cell count to supplied tray capacity without detecting plants. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedCells, totalCells } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalCells) &&
        totalCells >= 1 &&
        totalCells <= Number.MAX_SAFE_INTEGER,
      "totalCells",
    ),
      totalCells);
    (H.domain(
      Number.isSafeInteger(occupiedCells) &&
        occupiedCells >= 0 &&
        occupiedCells <= totalCells,
      "occupiedCells",
    ),
      occupiedCells);
    return {
      occupiedFraction: occupiedCells / totalCells,
      emptyCells: totalCells - occupiedCells,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupiedCells: 72, totalCells: 96 },
  output: { occupiedFraction: 0.75, emptyCells: 24 },
} satisfies ToolExample<Input, Output>;
export const growTrayOccupiedcellShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/grow-tray-occupied-cell-share",
    title: "Grow Tray Occupied Cell Share",
    description:
      "Normalize an explicit occupied-cell count to supplied tray capacity without detecting plants.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedCells: { type: "integer", minimum: 0 },
        totalCells: { type: "integer", minimum: 1 },
      },
      required: ["occupiedCells", "totalCells"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedFraction: { type: "number" },
        emptyCells: { type: "integer" },
      },
      required: ["occupiedFraction", "emptyCells"],
    },
    ports: {
      inputs: [
        {
          id: "occupiedCells",
          label: "Occupied Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCells",
          label: "Total Cells",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "occupiedFraction",
          label: "Occupied Fraction",
          valueType: { type: "number" },
        },
        {
          id: "emptyCells",
          label: "Empty Cells",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = growTrayOccupiedcellShareTool.execute;
export default growTrayOccupiedcellShareTool;
