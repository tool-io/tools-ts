import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minuteOfDay: number;
  readonly safeStartMinute: number;
  readonly safeEndMinute: number;
};
export type Output = { readonly withinRecordedWindow: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    safeStartMinute: { type: "integer", minimum: 0, maximum: 1439 },
    safeEndMinute: { type: "integer", minimum: 0, maximum: 1440 },
  },
  required: ["minuteOfDay", "safeStartMinute", "safeEndMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinRecordedWindow: { type: "boolean" } },
  required: ["withinRecordedWindow"],
} as const;
/** Check a local clock minute against an explicit half-open client-selected contact window, allowing midnight wrap; no contact is made. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minuteOfDay, safeStartMinute, safeEndMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(minuteOfDay) &&
        minuteOfDay >= 0 &&
        minuteOfDay <= 1439,
      "minuteOfDay",
    ),
      minuteOfDay);
    (H.domain(
      Number.isSafeInteger(safeStartMinute) &&
        safeStartMinute >= 0 &&
        safeStartMinute <= 1439,
      "safeStartMinute",
    ),
      safeStartMinute);
    (H.domain(
      Number.isSafeInteger(safeEndMinute) &&
        safeEndMinute >= 0 &&
        safeEndMinute <= 1440,
      "safeEndMinute",
    ),
      safeEndMinute);
    H.domain(safeStartMinute !== safeEndMinute, "safeStartMinute");
    return {
      withinRecordedWindow:
        safeStartMinute < safeEndMinute
          ? minuteOfDay >= safeStartMinute && minuteOfDay < safeEndMinute
          : minuteOfDay >= safeStartMinute || minuteOfDay < safeEndMinute,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minuteOfDay: 600, safeStartMinute: 540, safeEndMinute: 1020 },
  output: { withinRecordedWindow: true },
} satisfies ToolExample<Input, Output>;
export const clientContactSafeWindowMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/client-contact-safe-window-match",
    title: "Client Contact Safe Window Match Tool",
    description:
      "Check a local clock minute against an explicit half-open client-selected contact window, allowing midnight wrap; no contact is made.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        safeStartMinute: { type: "integer", minimum: 0, maximum: 1439 },
        safeEndMinute: { type: "integer", minimum: 0, maximum: 1440 },
      },
      required: ["minuteOfDay", "safeStartMinute", "safeEndMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinRecordedWindow: { type: "boolean" } },
      required: ["withinRecordedWindow"],
    },
    ports: {
      inputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "safeStartMinute",
          label: "Safe Start Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "safeEndMinute",
          label: "Safe End Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "withinRecordedWindow",
          label: "Within Recorded Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = clientContactSafeWindowMatchTool.execute;
export default clientContactSafeWindowMatchTool;
