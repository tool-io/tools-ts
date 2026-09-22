import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly occupied: readonly number[];
  readonly reserved: readonly number[];
};
export type Output = {
  readonly emptyIndices: readonly number[];
  readonly available: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "integer", minimum: 0, maximum: 256 },
    occupied: { type: "array", maxItems: 256, items: { type: "integer" } },
    reserved: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["capacity", "occupied", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emptyIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    available: { type: "integer" },
  },
  required: ["emptyIndices", "available"],
} as const;
/** Find free positions while deduplicating overlapping occupied and reserved slots. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, occupied, reserved } = request;
  const compute = (): Output => {
    H.integer(capacity, 0, 256);
    H.domain([...occupied, ...reserved].every((x) => x >= 0 && x < capacity));
    const blocked = new Set([...occupied, ...reserved]),
      emptyIndices = Array.from({ length: capacity }, (_, i) => i).filter(
        (i) => !blocked.has(i),
      );
    return { emptyIndices, available: emptyIndices.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 6, occupied: [0, 2, 2], reserved: [2, 5] },
  output: { emptyIndices: [1, 3, 4], available: 3 },
} satisfies ToolExample<Input, Output>;
export const biobankStorageBoxEmptyPositionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biobanking/biobank-storage-box-empty-position-count",
      title: "Biobank Storage Box Empty Position Count Tool",
      description:
        "Find free positions while deduplicating overlapping occupied and reserved slots.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacity: { type: "integer", minimum: 0, maximum: 256 },
          occupied: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          reserved: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["capacity", "occupied", "reserved"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          emptyIndices: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          available: { type: "integer" },
        },
        required: ["emptyIndices", "available"],
      },
      ports: {
        inputs: [
          {
            id: "capacity",
            label: "Capacity",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "occupied",
            label: "Occupied",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "emptyIndices",
            label: "Empty Indices",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biobankStorageBoxEmptyPositionCountTool.execute;
export default biobankStorageBoxEmptyPositionCountTool;
