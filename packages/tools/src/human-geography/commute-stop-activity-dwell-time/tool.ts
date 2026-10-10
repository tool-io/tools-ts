import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalTime: number;
  readonly departureTime: number;
};
export type Output = { readonly dwellTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalTime: { type: "number" },
    departureTime: { type: "number" },
  },
  required: ["arrivalTime", "departureTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dwellTime: { type: "number" } },
  required: ["dwellTime"],
} as const;
/** Calculate one supplied commute-stop dwell duration from ordered monotonic timestamps without inferring activity purpose. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalTime, departureTime } = request;
  const compute = (): Output => {
    H.domain(departureTime >= arrivalTime, "departureTime");
    return { dwellTime: departureTime - arrivalTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalTime: 480, departureTime: 495 },
  output: { dwellTime: 15 },
} satisfies ToolExample<Input, Output>;
export const commuteStopActivityDwellTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/commute-stop-activity-dwell-time",
    title: "Commute Stop Activity Dwell Time Tool",
    description:
      "Calculate one supplied commute-stop dwell duration from ordered monotonic timestamps without inferring activity purpose.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalTime: { type: "number" },
        departureTime: { type: "number" },
      },
      required: ["arrivalTime", "departureTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dwellTime: { type: "number" } },
      required: ["dwellTime"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalTime",
          label: "Arrival Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "departureTime",
          label: "Departure Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dwellTime", label: "Dwell Time", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = commuteStopActivityDwellTimeTool.execute;
export default commuteStopActivityDwellTimeTool;
