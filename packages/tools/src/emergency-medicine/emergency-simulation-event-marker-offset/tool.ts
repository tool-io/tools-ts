import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly referenceEventTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["eventTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceEventTime: { type: "number" } },
  required: ["referenceEventTime"],
} as const;
/** Apply an explicitly supplied signed clock offset to a training-simulation event marker without controlling equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return { referenceEventTime: eventTime + suppliedClockOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 12, suppliedClockOffset: 3 },
  output: { referenceEventTime: 15 },
} satisfies ToolExample<Input, Output>;
export const emergencySimulationEventMarkerOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "emergency-medicine/emergency-simulation-event-marker-offset",
      title: "Emergency Simulation Event Marker Offset Tool",
      description:
        "Apply an explicitly supplied signed clock offset to a training-simulation event marker without controlling equipment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eventTime: { type: "number" },
          suppliedClockOffset: { type: "number" },
        },
        required: ["eventTime", "suppliedClockOffset"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { referenceEventTime: { type: "number" } },
        required: ["referenceEventTime"],
      },
      ports: {
        inputs: [
          {
            id: "eventTime",
            label: "Event Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedClockOffset",
            label: "Supplied Clock Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referenceEventTime",
            label: "Reference Event Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = emergencySimulationEventMarkerOffsetTool.execute;
export default emergencySimulationEventMarkerOffsetTool;
