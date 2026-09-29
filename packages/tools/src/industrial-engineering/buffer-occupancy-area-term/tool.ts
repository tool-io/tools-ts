import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly occupancy: number; readonly duration: number };
export type Output = { readonly occupancyTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupancy: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
  },
  required: ["occupancy", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { occupancyTime: { type: "number" } },
  required: ["occupancyTime"],
} as const;
/** Compute one rectangular queue-occupancy integral contribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupancy, duration } = request;
  const compute = (): Output => {
    H.domain(occupancy >= 0 && duration >= 0);
    return { occupancyTime: occupancy * duration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupancy: 4, duration: 3 },
  output: { occupancyTime: 12 },
} satisfies ToolExample<Input, Output>;
export const bufferOccupancyAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/buffer-occupancy-area-term",
    title: "Buffer Occupancy Area Term Tool",
    description:
      "Compute one rectangular queue-occupancy integral contribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupancy: { type: "number", minimum: 0 },
        duration: { type: "number", minimum: 0 },
      },
      required: ["occupancy", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { occupancyTime: { type: "number" } },
      required: ["occupancyTime"],
    },
    ports: {
      inputs: [
        {
          id: "occupancy",
          label: "Occupancy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "occupancyTime",
          label: "Occupancy Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bufferOccupancyAreaTermTool.execute;
export default bufferOccupancyAreaTermTool;
