import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localClockMinutes: number;
  readonly offsetMinutes: number;
  readonly offsetKnown: boolean;
};
export type Output = {
  readonly referenceKnown: boolean;
  readonly referenceMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localClockMinutes: { type: "integer" },
    offsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
    offsetKnown: { type: "boolean" },
  },
  required: ["localClockMinutes", "offsetMinutes", "offsetKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceKnown: { type: "boolean" },
    referenceMinutes: { type: "integer" },
  },
  required: ["referenceKnown", "referenceMinutes"],
} as const;
/** Convert a supplied notice clock index only when its offset is known; no notification deadline is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localClockMinutes, offsetMinutes, offsetKnown } = request;
  const compute = (): Output => {
    H.integer(localClockMinutes, -Number.MAX_SAFE_INTEGER);
    H.integer(offsetMinutes, -1439, 1439);
    return {
      referenceKnown: offsetKnown,
      referenceMinutes: offsetKnown ? localClockMinutes - offsetMinutes : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localClockMinutes: 600, offsetMinutes: 120, offsetKnown: true },
  output: { referenceKnown: true, referenceMinutes: 480 },
} satisfies ToolExample<Input, Output>;
export const consularNoticeTimezoneTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/consular-notice-timezone-token",
    title: "Consular Notice Timezone Token Tool",
    description:
      "Convert a supplied notice clock index only when its offset is known; no notification deadline is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localClockMinutes: { type: "integer" },
        offsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
        offsetKnown: { type: "boolean" },
      },
      required: ["localClockMinutes", "offsetMinutes", "offsetKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceKnown: { type: "boolean" },
        referenceMinutes: { type: "integer" },
      },
      required: ["referenceKnown", "referenceMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "localClockMinutes",
          label: "Local Clock Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetMinutes",
          label: "Offset Minutes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "referenceKnown",
          label: "Reference Known",
          valueType: { type: "boolean" },
        },
        {
          id: "referenceMinutes",
          label: "Reference Minutes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = consularNoticeTimezoneTokenTool.execute;
export default consularNoticeTimezoneTokenTool;
