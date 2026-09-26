import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distanceMeters: number;
  readonly durationMinutes: number;
  readonly pausedMinutes: number;
  readonly sightings: number;
};
export type Output = {
  readonly activeMinutes: number;
  readonly speedMetersPerMinute: number;
  readonly sightingsPerKm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceMeters: { type: "number", exclusiveMinimum: 0 },
    durationMinutes: { type: "number" },
    pausedMinutes: { type: "number", minimum: 0 },
    sightings: { type: "integer", minimum: 0 },
  },
  required: ["distanceMeters", "durationMinutes", "pausedMinutes", "sightings"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMinutes: { type: "number" },
    speedMetersPerMinute: { type: "number" },
    sightingsPerKm: { type: "number" },
  },
  required: ["activeMinutes", "speedMetersPerMinute", "sightingsPerKm"],
} as const;
/** Calculate butterfly transect time distance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distanceMeters, durationMinutes, pausedMinutes, sightings } = request;
  const compute = (): Output => {
    H.positive(distanceMeters);
    H.domain(pausedMinutes >= 0 && durationMinutes > pausedMinutes);
    H.integer(sightings, 0);
    return {
      activeMinutes: durationMinutes - pausedMinutes,
      speedMetersPerMinute: distanceMeters / (durationMinutes - pausedMinutes),
      sightingsPerKm: (sightings * 1000) / distanceMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    distanceMeters: 1000,
    durationMinutes: 30,
    pausedMinutes: 5,
    sightings: 20,
  },
  output: { activeMinutes: 25, speedMetersPerMinute: 40, sightingsPerKm: 20 },
} satisfies ToolExample<Input, Output>;
export const butterflyTransectTimeDistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/butterfly-transect-time-distance-term",
    title: "Butterfly Transect Time Distance Term Tool",
    description:
      "Calculate butterfly transect time distance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceMeters: { type: "number", exclusiveMinimum: 0 },
        durationMinutes: { type: "number" },
        pausedMinutes: { type: "number", minimum: 0 },
        sightings: { type: "integer", minimum: 0 },
      },
      required: [
        "distanceMeters",
        "durationMinutes",
        "pausedMinutes",
        "sightings",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMinutes: { type: "number" },
        speedMetersPerMinute: { type: "number" },
        sightingsPerKm: { type: "number" },
      },
      required: ["activeMinutes", "speedMetersPerMinute", "sightingsPerKm"],
    },
    ports: {
      inputs: [
        {
          id: "distanceMeters",
          label: "Distance Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "pausedMinutes",
          label: "Paused Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "sightings",
          label: "Sightings",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "activeMinutes",
          label: "Active Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "speedMetersPerMinute",
          label: "Speed Meters Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "sightingsPerKm",
          label: "Sightings Per Km",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = butterflyTransectTimeDistanceTermTool.execute;
export default butterflyTransectTimeDistanceTermTool;
