import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly stored: number;
  readonly reserved: number;
};
export type Output = { readonly remaining: number; readonly available: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", minimum: 0 },
    stored: { type: "number", minimum: 0 },
    reserved: { type: "number", minimum: 0 },
  },
  required: ["capacity", "stored", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, available: { type: "number" } },
  required: ["remaining", "available"],
} as const;
/** Calculate catchment storage remaining volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, stored, reserved } = request;
  const compute = (): Output => {
    H.domain(capacity >= 0 && stored >= 0 && reserved >= 0);
    return {
      remaining: capacity - stored - reserved,
      available: Math.max(0, capacity - stored - reserved),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 100, stored: 60, reserved: 20 },
  output: { remaining: 20, available: 20 },
} satisfies ToolExample<Input, Output>;
export const catchmentStorageRemainingVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/catchment-storage-remaining-volume",
    title: "Catchment Storage Remaining Volume Tool",
    description:
      "Calculate catchment storage remaining volume from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", minimum: 0 },
        stored: { type: "number", minimum: 0 },
        reserved: { type: "number", minimum: 0 },
      },
      required: ["capacity", "stored", "reserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        available: { type: "number" },
      },
      required: ["remaining", "available"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stored",
          label: "Stored",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "available", label: "Available", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = catchmentStorageRemainingVolumeTool.execute;
export default catchmentStorageRemainingVolumeTool;
