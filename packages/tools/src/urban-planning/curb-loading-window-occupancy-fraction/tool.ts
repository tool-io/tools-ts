import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupiedMinutes: number;
  readonly totalMinutes: number;
  readonly unavailableMinutes: number;
};
export type Output = {
  readonly availableMinutes: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedMinutes: { type: "number", minimum: 0 },
    totalMinutes: { type: "number" },
    unavailableMinutes: { type: "number", minimum: 0 },
  },
  required: ["occupiedMinutes", "totalMinutes", "unavailableMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["availableMinutes", "fraction"],
} as const;
/** Calculate curb loading window occupancy fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedMinutes, totalMinutes, unavailableMinutes } = request;
  const compute = (): Output => {
    H.domain(
      unavailableMinutes >= 0 &&
        totalMinutes > unavailableMinutes &&
        occupiedMinutes >= 0 &&
        occupiedMinutes <= totalMinutes - unavailableMinutes,
    );
    return {
      availableMinutes: totalMinutes - unavailableMinutes,
      fraction: occupiedMinutes / (totalMinutes - unavailableMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupiedMinutes: 90, totalMinutes: 120, unavailableMinutes: 20 },
  output: { availableMinutes: 100, fraction: 0.9 },
} satisfies ToolExample<Input, Output>;
export const curbLoadingWindowOccupancyFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/curb-loading-window-occupancy-fraction",
    title: "Curb Loading Window Occupancy Fraction Tool",
    description:
      "Calculate curb loading window occupancy fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedMinutes: { type: "number", minimum: 0 },
        totalMinutes: { type: "number" },
        unavailableMinutes: { type: "number", minimum: 0 },
      },
      required: ["occupiedMinutes", "totalMinutes", "unavailableMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["availableMinutes", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "occupiedMinutes",
          label: "Occupied Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMinutes",
          label: "Total Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unavailableMinutes",
          label: "Unavailable Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = curbLoadingWindowOccupancyFractionTool.execute;
export default curbLoadingWindowOccupancyFractionTool;
