import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly levels: number;
  readonly levelSpacing: number;
  readonly speed: number;
  readonly stopSeconds: number;
  readonly trips: number;
};
export type Output = {
  readonly travelTime: number;
  readonly totalTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levels: { type: "integer", minimum: 1 },
    levelSpacing: { type: "number", minimum: 0 },
    speed: { type: "number", exclusiveMinimum: 0 },
    stopSeconds: { type: "number", minimum: 0 },
    trips: { type: "integer", minimum: 0 },
  },
  required: ["levels", "levelSpacing", "speed", "stopSeconds", "trips"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { travelTime: { type: "number" }, totalTime: { type: "number" } },
  required: ["travelTime", "totalTime"],
} as const;
/** Calculate vertical farm lift travel time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { levels, levelSpacing, speed, stopSeconds, trips } = request;
  const compute = (): Output => {
    H.integer(levels, 1);
    H.integer(trips, 0);
    H.domain(levelSpacing >= 0 && stopSeconds >= 0);
    H.positive(speed);
    return {
      travelTime: (Math.max(0, levels - 1) * levelSpacing * trips) / speed,
      totalTime:
        (Math.max(0, levels - 1) * levelSpacing * trips) / speed +
        levels * stopSeconds * trips,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    levels: 5,
    levelSpacing: 0.5,
    speed: 0.25,
    stopSeconds: 2,
    trips: 2,
  },
  output: { travelTime: 16, totalTime: 36 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmLiftTravelTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/vertical-farm-lift-travel-time-factor",
    title: "Vertical Farm Lift Travel Time Factor Tool",
    description:
      "Calculate vertical farm lift travel time factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levels: { type: "integer", minimum: 1 },
        levelSpacing: { type: "number", minimum: 0 },
        speed: { type: "number", exclusiveMinimum: 0 },
        stopSeconds: { type: "number", minimum: 0 },
        trips: { type: "integer", minimum: 0 },
      },
      required: ["levels", "levelSpacing", "speed", "stopSeconds", "trips"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        travelTime: { type: "number" },
        totalTime: { type: "number" },
      },
      required: ["travelTime", "totalTime"],
    },
    ports: {
      inputs: [
        {
          id: "levels",
          label: "Levels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "levelSpacing",
          label: "Level Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stopSeconds",
          label: "Stop Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trips",
          label: "Trips",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "travelTime",
          label: "Travel Time",
          valueType: { type: "number" },
        },
        { id: "totalTime", label: "Total Time", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = verticalFarmLiftTravelTimeFactorTool.execute;
export default verticalFarmLiftTravelTimeFactorTool;
