import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookedDurations: readonly number[];
  readonly setupDurations: readonly number[];
  readonly availableDuration: number;
};
export type Output = {
  readonly bookedTime: number;
  readonly setupTime: number;
  readonly slack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    setupDurations: { type: "array", maxItems: 256, items: { type: "number" } },
    availableDuration: { type: "number", minimum: 0 },
  },
  required: ["bookedDurations", "setupDurations", "availableDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookedTime: { type: "number" },
    setupTime: { type: "number" },
    slack: { type: "number" },
  },
  required: ["bookedTime", "setupTime", "slack"],
} as const;
/** Calculate equipment booking capacity slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bookedDurations, setupDurations, availableDuration } = request;
  const compute = (): Output => {
    H.sameLength(bookedDurations, setupDurations);
    H.domain(
      [...bookedDurations, ...setupDurations].every((x) => x >= 0) &&
        availableDuration >= 0,
    );
    return (() => {
      const bookedTime = bookedDurations.reduce((a, b) => a + b, 0),
        setupTime = setupDurations.reduce((a, b) => a + b, 0);
      return {
        bookedTime,
        setupTime,
        slack: availableDuration - bookedTime - setupTime,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bookedDurations: [2, 3],
    setupDurations: [1, 1],
    availableDuration: 10,
  },
  output: { bookedTime: 5, setupTime: 2, slack: 3 },
} satisfies ToolExample<Input, Output>;
export const equipmentBookingCapacitySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/equipment-booking-capacity-slack",
    title: "Equipment Booking Capacity Slack Tool",
    description:
      "Calculate equipment booking capacity slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookedDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        setupDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        availableDuration: { type: "number", minimum: 0 },
      },
      required: ["bookedDurations", "setupDurations", "availableDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookedTime: { type: "number" },
        setupTime: { type: "number" },
        slack: { type: "number" },
      },
      required: ["bookedTime", "setupTime", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "bookedDurations",
          label: "Booked Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "setupDurations",
          label: "Setup Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "availableDuration",
          label: "Available Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bookedTime",
          label: "Booked Time",
          valueType: { type: "number" },
        },
        { id: "setupTime", label: "Setup Time", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = equipmentBookingCapacitySlackTool.execute;
export default equipmentBookingCapacitySlackTool;
