import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly localHour: number;
  readonly localMinute: number;
};
export type Output = { readonly label: string; readonly minuteOfDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    localHour: { type: "integer", minimum: 0, maximum: 23 },
    localMinute: { type: "integer", minimum: 0, maximum: 59 },
  },
  required: ["sampleId", "localHour", "localMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    minuteOfDay: { type: "integer" },
  },
  required: ["label", "minuteOfDay"],
} as const;
/** Label an explicitly recorded hormone-sample local clock time without interpreting circadian phase or reference ranges. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, localHour, localMinute } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    (H.domain(
      Number.isSafeInteger(localHour) && localHour >= 0 && localHour <= 23,
      "localHour",
    ),
      localHour);
    (H.domain(
      Number.isSafeInteger(localMinute) &&
        localMinute >= 0 &&
        localMinute <= 59,
      "localMinute",
    ),
      localMinute);
    return {
      label:
        sampleId +
        " at " +
        String(localHour).padStart(2, "0") +
        ":" +
        String(localMinute).padStart(2, "0") +
        " local",
      minuteOfDay: localHour * 60 + localMinute,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", localHour: 8, localMinute: 30 },
  output: { label: "S17 at 08:30 local", minuteOfDay: 510 },
} satisfies ToolExample<Input, Output>;
export const hormoneSampleClockPhaseLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/hormone-sample-clock-phase-label",
    title: "Hormone Sample Clock Phase Label",
    description:
      "Label an explicitly recorded hormone-sample local clock time without interpreting circadian phase or reference ranges.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        localHour: { type: "integer", minimum: 0, maximum: 23 },
        localMinute: { type: "integer", minimum: 0, maximum: 59 },
      },
      required: ["sampleId", "localHour", "localMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        minuteOfDay: { type: "integer" },
      },
      required: ["label", "minuteOfDay"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "localHour",
          label: "Local Hour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "localMinute",
          label: "Local Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = hormoneSampleClockPhaseLabelTool.execute;
export default hormoneSampleClockPhaseLabelTool;
