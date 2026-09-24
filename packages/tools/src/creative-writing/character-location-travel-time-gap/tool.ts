import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableHours: number;
  readonly distance: number;
  readonly speed: number;
  readonly stopHours: number;
};
export type Output = {
  readonly requiredHours: number;
  readonly slackHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHours: { type: "number", minimum: 0 },
    distance: { type: "number", minimum: 0 },
    speed: { type: "number", exclusiveMinimum: 0 },
    stopHours: { type: "number", minimum: 0 },
  },
  required: ["availableHours", "distance", "speed", "stopHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHours: { type: "number" },
    slackHours: { type: "number" },
  },
  required: ["requiredHours", "slackHours"],
} as const;
/** Calculate character location travel time gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableHours, distance, speed, stopHours } = request;
  const compute = (): Output => {
    H.domain(availableHours >= 0 && distance >= 0 && stopHours >= 0);
    H.positive(speed);
    return {
      requiredHours: distance / speed + stopHours,
      slackHours: availableHours - distance / speed - stopHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableHours: 5, distance: 120, speed: 40, stopHours: 1 },
  output: { requiredHours: 4, slackHours: 1 },
} satisfies ToolExample<Input, Output>;
export const characterLocationTravelTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/character-location-travel-time-gap",
    title: "Character Location Travel Time Gap Tool",
    description:
      "Calculate character location travel time gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableHours: { type: "number", minimum: 0 },
        distance: { type: "number", minimum: 0 },
        speed: { type: "number", exclusiveMinimum: 0 },
        stopHours: { type: "number", minimum: 0 },
      },
      required: ["availableHours", "distance", "speed", "stopHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredHours: { type: "number" },
        slackHours: { type: "number" },
      },
      required: ["requiredHours", "slackHours"],
    },
    ports: {
      inputs: [
        {
          id: "availableHours",
          label: "Available Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distance",
          label: "Distance",
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
          id: "stopHours",
          label: "Stop Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredHours",
          label: "Required Hours",
          valueType: { type: "number" },
        },
        {
          id: "slackHours",
          label: "Slack Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterLocationTravelTimeGapTool.execute;
export default characterLocationTravelTimeGapTool;
