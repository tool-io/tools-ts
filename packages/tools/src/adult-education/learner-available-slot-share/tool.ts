import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotDurations: readonly number[];
  readonly available: readonly boolean[];
  readonly accessible: readonly boolean[];
};
export type Output = {
  readonly eligibleDuration: number;
  readonly availableDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    available: { type: "array", maxItems: 256, items: { type: "boolean" } },
    accessible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["slotDurations", "available", "accessible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    availableDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleDuration", "availableDuration", "share", "defined"],
} as const;
/** Calculate learner available slot share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotDurations, available, accessible } = request;
  const compute = (): Output => {
    H.sameLength(slotDurations, available);
    H.sameLength(slotDurations, accessible);
    H.domain(slotDurations.every((x) => x >= 0));
    return (() => {
      const eligibleDuration = slotDurations.reduce(
          (s, x, i) => s + (accessible[i] ? x : 0),
          0,
        ),
        availableDuration = slotDurations.reduce(
          (s, x, i) => s + (accessible[i] && available[i] ? x : 0),
          0,
        );
      return {
        eligibleDuration,
        availableDuration,
        share: eligibleDuration > 0 ? availableDuration / eligibleDuration : 0,
        defined: eligibleDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slotDurations: [2, 3, 5],
    available: [true, false, true],
    accessible: [true, true, false],
  },
  output: {
    eligibleDuration: 5,
    availableDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const learnerAvailableSlotShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/learner-available-slot-share",
    title: "Learner Available Slot Share Tool",
    description:
      "Calculate learner available slot share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slotDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        available: { type: "array", maxItems: 256, items: { type: "boolean" } },
        accessible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["slotDurations", "available", "accessible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        availableDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleDuration", "availableDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "slotDurations",
          label: "Slot Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "accessible",
          label: "Accessible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          valueType: { type: "number" },
        },
        {
          id: "availableDuration",
          label: "Available Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = learnerAvailableSlotShareTool.execute;
export default learnerAvailableSlotShareTool;
