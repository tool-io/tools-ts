import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hour: number;
  readonly minute: number;
  readonly offsetMinutes: number;
};
export type Output = {
  readonly dayOffset: number;
  readonly hour: number;
  readonly minute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer", minimum: 0, maximum: 23 },
    minute: { type: "integer", minimum: 0, maximum: 59 },
    offsetMinutes: { type: "integer" },
  },
  required: ["hour", "minute", "offsetMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayOffset: { type: "integer" },
    hour: { type: "integer" },
    minute: { type: "integer" },
  },
  required: ["dayOffset", "hour", "minute"],
} as const;
/** Shift a supplied clock time with exact day carry; no time zone, availability, consent or contact-safety inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hour, minute, offsetMinutes } = request;
  const compute = (): Output => {
    H.integer(hour, 0, 23);
    H.integer(minute, 0, 59);
    const total = BigInt(hour * 60 + minute) + BigInt(offsetMinutes);
    let d = total / 1440n,
      r = total % 1440n;
    if (r < 0n) {
      d--;
      r += 1440n;
    }
    return {
      dayOffset: Number(d),
      hour: Number(r / 60n),
      minute: Number(r % 60n),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hour: 23, minute: 45, offsetMinutes: 90 },
  output: { dayOffset: 1, hour: 1, minute: 15 },
} satisfies ToolExample<Input, Output>;
export const familyContactSafeClockOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/family-contact-safe-clock-offset",
    title: "Family Contact Safe Clock Offset Tool",
    description:
      "Shift a supplied clock time with exact day carry; no time zone, availability, consent or contact-safety inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hour: { type: "integer", minimum: 0, maximum: 23 },
        minute: { type: "integer", minimum: 0, maximum: 59 },
        offsetMinutes: { type: "integer" },
      },
      required: ["hour", "minute", "offsetMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayOffset: { type: "integer" },
        hour: { type: "integer" },
        minute: { type: "integer" },
      },
      required: ["dayOffset", "hour", "minute"],
    },
    ports: {
      inputs: [
        {
          id: "hour",
          label: "Hour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minute",
          label: "Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetMinutes",
          label: "Offset Minutes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "dayOffset",
          label: "Day Offset",
          valueType: { type: "integer" },
        },
        { id: "hour", label: "Hour", valueType: { type: "integer" } },
        { id: "minute", label: "Minute", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = familyContactSafeClockOffsetTool.execute;
export default familyContactSafeClockOffsetTool;
