import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerTime: number;
  readonly pauseStart: number;
  readonly pauseEnd: number;
  readonly affinity: string;
};
export type Output = { readonly adjustedTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerTime: { type: "number" },
    pauseStart: { type: "number" },
    pauseEnd: { type: "number" },
    affinity: { type: "string", maxLength: 8192, enum: ["before", "after"] },
  },
  required: ["markerTime", "pauseStart", "pauseEnd", "affinity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedTime: { type: "number" } },
  required: ["adjustedTime"],
} as const;
/** Restore an active-time exercise marker across one removed pause; affinity selects the wall-clock side of the collapsed pause. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerTime, pauseStart, pauseEnd, affinity } = request;
  const compute = (): Output => {
    H.domain(pauseEnd >= pauseStart && ["before", "after"].includes(affinity));
    return {
      adjustedTime:
        markerTime < pauseStart
          ? markerTime
          : markerTime > pauseStart
            ? markerTime + pauseEnd - pauseStart
            : affinity === "before"
              ? pauseStart
              : pauseEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerTime: 10, pauseStart: 10, pauseEnd: 20, affinity: "before" },
  output: { adjustedTime: 10 },
} satisfies ToolExample<Input, Output>;
export const drillInjectMarkerClockAffinityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/drill-inject-marker-clock-affinity",
    title: "Drill Inject Marker Clock Affinity Tool",
    description:
      "Restore an active-time exercise marker across one removed pause; affinity selects the wall-clock side of the collapsed pause.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerTime: { type: "number" },
        pauseStart: { type: "number" },
        pauseEnd: { type: "number" },
        affinity: {
          type: "string",
          maxLength: 8192,
          enum: ["before", "after"],
        },
      },
      required: ["markerTime", "pauseStart", "pauseEnd", "affinity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { adjustedTime: { type: "number" } },
      required: ["adjustedTime"],
    },
    ports: {
      inputs: [
        {
          id: "markerTime",
          label: "Marker Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseStart",
          label: "Pause Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseEnd",
          label: "Pause End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "affinity",
          label: "Affinity",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "adjustedTime",
          label: "Adjusted Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = drillInjectMarkerClockAffinityTool.execute;
export default drillInjectMarkerClockAffinityTool;
