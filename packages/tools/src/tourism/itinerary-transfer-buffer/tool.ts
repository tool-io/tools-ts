import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrival: number;
  readonly departure: number;
  readonly suppliedTransferDuration: number;
};
export type Output = { readonly available: number; readonly buffer: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrival: { type: "number" },
    departure: { type: "number" },
    suppliedTransferDuration: { type: "number", minimum: 0 },
  },
  required: ["arrival", "departure", "suppliedTransferDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "number" }, buffer: { type: "number" } },
  required: ["available", "buffer"],
} as const;
/** Compare supplied itinerary timestamps and transfer duration in one time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrival, departure, suppliedTransferDuration } = request;
  const compute = (): Output => {
    H.domain(suppliedTransferDuration >= 0);
    return {
      available: departure - arrival,
      buffer: departure - arrival - suppliedTransferDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrival: 100, departure: 150, suppliedTransferDuration: 30 },
  output: { available: 50, buffer: 20 },
} satisfies ToolExample<Input, Output>;
export const itineraryTransferBufferTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/itinerary-transfer-buffer",
    title: "Itinerary Transfer Buffer Tool",
    description:
      "Compare supplied itinerary timestamps and transfer duration in one time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrival: { type: "number" },
        departure: { type: "number" },
        suppliedTransferDuration: { type: "number", minimum: 0 },
      },
      required: ["arrival", "departure", "suppliedTransferDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { available: { type: "number" }, buffer: { type: "number" } },
      required: ["available", "buffer"],
    },
    ports: {
      inputs: [
        {
          id: "arrival",
          label: "Arrival",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "departure",
          label: "Departure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTransferDuration",
          label: "Supplied Transfer Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "number" } },
        { id: "buffer", label: "Buffer", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = itineraryTransferBufferTool.execute;
export default itineraryTransferBufferTool;
