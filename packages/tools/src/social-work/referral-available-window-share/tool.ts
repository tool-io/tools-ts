import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly availableStart: number;
  readonly availableEnd: number;
  readonly requiredDuration: number;
};
export type Output = {
  readonly availableOverlap: number;
  readonly share: number;
  readonly durationSlack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    availableStart: { type: "number" },
    availableEnd: { type: "number" },
    requiredDuration: { type: "number", minimum: 0 },
  },
  required: [
    "windowStart",
    "windowEnd",
    "availableStart",
    "availableEnd",
    "requiredDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableOverlap: { type: "number" },
    share: { type: "number" },
    durationSlack: { type: "number" },
  },
  required: ["availableOverlap", "share", "durationSlack"],
} as const;
/** Calculate referral available window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    windowStart,
    windowEnd,
    availableStart,
    availableEnd,
    requiredDuration,
  } = request;
  const compute = (): Output => {
    H.domain(
      windowEnd > windowStart &&
        availableEnd >= availableStart &&
        requiredDuration >= 0,
    );
    return (() => {
      const availableOverlap = Math.max(
        0,
        Math.min(windowEnd, availableEnd) -
          Math.max(windowStart, availableStart),
      );
      return {
        availableOverlap,
        share: availableOverlap / (windowEnd - windowStart),
        durationSlack: availableOverlap - requiredDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    windowStart: 0,
    windowEnd: 10,
    availableStart: 4,
    availableEnd: 12,
    requiredDuration: 3,
  },
  output: { availableOverlap: 6, share: 0.6, durationSlack: 3 },
} satisfies ToolExample<Input, Output>;
export const referralAvailableWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/referral-available-window-share",
    title: "Referral Available Window Share Tool",
    description:
      "Calculate referral available window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        availableStart: { type: "number" },
        availableEnd: { type: "number" },
        requiredDuration: { type: "number", minimum: 0 },
      },
      required: [
        "windowStart",
        "windowEnd",
        "availableStart",
        "availableEnd",
        "requiredDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableOverlap: { type: "number" },
        share: { type: "number" },
        durationSlack: { type: "number" },
      },
      required: ["availableOverlap", "share", "durationSlack"],
    },
    ports: {
      inputs: [
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableStart",
          label: "Available Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableEnd",
          label: "Available End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredDuration",
          label: "Required Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableOverlap",
          label: "Available Overlap",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "durationSlack",
          label: "Duration Slack",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referralAvailableWindowShareTool.execute;
export default referralAvailableWindowShareTool;
