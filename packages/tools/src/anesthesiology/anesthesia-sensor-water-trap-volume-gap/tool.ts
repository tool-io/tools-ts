import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly initialVolume: number;
  readonly collectedVolume: number;
  readonly drainedVolume: number;
  readonly reserve: number;
};
export type Output = {
  readonly finalVolume: number;
  readonly freeVolume: number;
  readonly reserveMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", minimum: 0 },
    initialVolume: { type: "number", minimum: 0 },
    collectedVolume: { type: "number", minimum: 0 },
    drainedVolume: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
  },
  required: [
    "capacity",
    "initialVolume",
    "collectedVolume",
    "drainedVolume",
    "reserve",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalVolume: { type: "number" },
    freeVolume: { type: "number" },
    reserveMargin: { type: "number" },
  },
  required: ["finalVolume", "freeVolume", "reserveMargin"],
} as const;
/** Reconcile supplied bench trap-volume records without device operating advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, initialVolume, collectedVolume, drainedVolume, reserve } =
    request;
  const compute = (): Output => {
    H.domain(
      capacity >= 0 &&
        initialVolume >= 0 &&
        collectedVolume >= 0 &&
        drainedVolume >= 0 &&
        drainedVolume <= initialVolume + collectedVolume &&
        reserve >= 0,
    );
    return {
      finalVolume: initialVolume + collectedVolume - drainedVolume,
      freeVolume: capacity - initialVolume - collectedVolume + drainedVolume,
      reserveMargin:
        capacity - initialVolume - collectedVolume + drainedVolume - reserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    capacity: 100,
    initialVolume: 20,
    collectedVolume: 30,
    drainedVolume: 10,
    reserve: 15,
  },
  output: { finalVolume: 40, freeVolume: 60, reserveMargin: 45 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaSensorWaterTrapVolumeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/anesthesia-sensor-water-trap-volume-gap",
    title: "Anesthesia Sensor Water Trap Volume Gap Tool",
    description:
      "Reconcile supplied bench trap-volume records without device operating advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", minimum: 0 },
        initialVolume: { type: "number", minimum: 0 },
        collectedVolume: { type: "number", minimum: 0 },
        drainedVolume: { type: "number", minimum: 0 },
        reserve: { type: "number", minimum: 0 },
      },
      required: [
        "capacity",
        "initialVolume",
        "collectedVolume",
        "drainedVolume",
        "reserve",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalVolume: { type: "number" },
        freeVolume: { type: "number" },
        reserveMargin: { type: "number" },
      },
      required: ["finalVolume", "freeVolume", "reserveMargin"],
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
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectedVolume",
          label: "Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainedVolume",
          label: "Drained Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finalVolume",
          label: "Final Volume",
          valueType: { type: "number" },
        },
        {
          id: "freeVolume",
          label: "Free Volume",
          valueType: { type: "number" },
        },
        {
          id: "reserveMargin",
          label: "Reserve Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaSensorWaterTrapVolumeGapTool.execute;
export default anesthesiaSensorWaterTrapVolumeGapTool;
