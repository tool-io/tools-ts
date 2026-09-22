import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rows: number;
  readonly columns: number;
  readonly occupiedSlots: readonly number[];
  readonly reservedSlots: readonly number[];
};
export type Output = {
  readonly totalSlots: number;
  readonly freeSlots: number;
  readonly overlappingReservations: readonly number[];
  readonly duplicateOccupancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1, maximum: 256 },
    columns: { type: "integer", minimum: 1, maximum: 256 },
    occupiedSlots: { type: "array", maxItems: 256, items: { type: "integer" } },
    reservedSlots: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["rows", "columns", "occupiedSlots", "reservedSlots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSlots: { type: "integer" },
    freeSlots: { type: "integer" },
    overlappingReservations: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    duplicateOccupancy: { type: "integer" },
  },
  required: [
    "totalSlots",
    "freeSlots",
    "overlappingReservations",
    "duplicateOccupancy",
  ],
} as const;
/** Calculate storage box slot closure token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rows, columns, occupiedSlots, reservedSlots } = request;
  const compute = (): Output => {
    H.integer(rows, 1, 256);
    H.integer(columns, 1, 256);
    const totalSlots = rows * columns;
    H.domain(
      [...occupiedSlots, ...reservedSlots].every(
        (x) => x >= 0 && x < totalSlots,
      ),
    );
    return {
      totalSlots,
      freeSlots:
        totalSlots - new Set([...occupiedSlots, ...reservedSlots]).size,
      overlappingReservations: [...new Set(reservedSlots)].filter((x) =>
        occupiedSlots.includes(x),
      ),
      duplicateOccupancy: occupiedSlots.length - new Set(occupiedSlots).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rows: 2,
    columns: 3,
    occupiedSlots: [0, 1, 1],
    reservedSlots: [1, 2],
  },
  output: {
    totalSlots: 6,
    freeSlots: 3,
    overlappingReservations: [1],
    duplicateOccupancy: 1,
  },
} satisfies ToolExample<Input, Output>;
export const storageBoxSlotClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/storage-box-slot-closure-token",
    title: "Storage Box Slot Closure Token Tool",
    description:
      "Calculate storage box slot closure token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer", minimum: 1, maximum: 256 },
        columns: { type: "integer", minimum: 1, maximum: 256 },
        occupiedSlots: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        reservedSlots: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["rows", "columns", "occupiedSlots", "reservedSlots"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSlots: { type: "integer" },
        freeSlots: { type: "integer" },
        overlappingReservations: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        duplicateOccupancy: { type: "integer" },
      },
      required: [
        "totalSlots",
        "freeSlots",
        "overlappingReservations",
        "duplicateOccupancy",
      ],
    },
    ports: {
      inputs: [
        {
          id: "rows",
          label: "Rows",
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
          id: "occupiedSlots",
          label: "Occupied Slots",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "reservedSlots",
          label: "Reserved Slots",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "totalSlots",
          label: "Total Slots",
          valueType: { type: "integer" },
        },
        {
          id: "freeSlots",
          label: "Free Slots",
          valueType: { type: "integer" },
        },
        {
          id: "overlappingReservations",
          label: "Overlapping Reservations",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicateOccupancy",
          label: "Duplicate Occupancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = storageBoxSlotClosureTokenTool.execute;
export default storageBoxSlotClosureTokenTool;
