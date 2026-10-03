import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedBits: number;
  readonly occupiedPlanes: readonly number[];
};
export type Output = {
  readonly availablePlanes: readonly number[];
  readonly duplicatePlanes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedBits: { type: "integer", minimum: 1, maximum: 64 },
    occupiedPlanes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["allocatedBits", "occupiedPlanes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availablePlanes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    duplicatePlanes: { type: "integer" },
  },
  required: ["availablePlanes", "duplicatePlanes"],
} as const;
/** Audit caller-supplied bit-plane occupancy only; not a DICOM overlay compatibility or encoding validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedBits, occupiedPlanes } = request;
  const compute = (): Output => {
    H.integer(allocatedBits, 1, 64);
    H.domain(occupiedPlanes.every((x) => x >= 0 && x < allocatedBits));
    return {
      availablePlanes: Array.from(
        { length: allocatedBits },
        (_, i) => i,
      ).filter((i) => !occupiedPlanes.includes(i)),
      duplicatePlanes: occupiedPlanes.length - new Set(occupiedPlanes).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedBits: 8, occupiedPlanes: [0, 2, 2] },
  output: { availablePlanes: [1, 3, 4, 5, 6, 7], duplicatePlanes: 1 },
} satisfies ToolExample<Input, Output>;
export const dicomOverlayBitPlaneBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-overlay-bit-plane-budget",
    title: "DICOM Overlay Bit Plane Budget Tool",
    description:
      "Audit caller-supplied bit-plane occupancy only; not a DICOM overlay compatibility or encoding validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedBits: { type: "integer", minimum: 1, maximum: 64 },
        occupiedPlanes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["allocatedBits", "occupiedPlanes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availablePlanes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        duplicatePlanes: { type: "integer" },
      },
      required: ["availablePlanes", "duplicatePlanes"],
    },
    ports: {
      inputs: [
        {
          id: "allocatedBits",
          label: "Allocated Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "occupiedPlanes",
          label: "Occupied Planes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "availablePlanes",
          label: "Available Planes",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicatePlanes",
          label: "Duplicate Planes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomOverlayBitPlaneBudgetTool.execute;
export default dicomOverlayBitPlaneBudgetTool;
