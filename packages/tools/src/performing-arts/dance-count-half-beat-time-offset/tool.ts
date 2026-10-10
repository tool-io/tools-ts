import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly halfBeatCount: number;
  readonly beatsPerMinute: number;
};
export type Output = { readonly offsetSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    halfBeatCount: { type: "integer" },
    beatsPerMinute: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["halfBeatCount", "beatsPerMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetSeconds: { type: "number" } },
  required: ["offsetSeconds"],
} as const;
/** Convert an explicit signed half-beat count to elapsed seconds at a supplied constant tempo. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { halfBeatCount, beatsPerMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(halfBeatCount) &&
        halfBeatCount >= -Number.MAX_SAFE_INTEGER &&
        halfBeatCount <= Number.MAX_SAFE_INTEGER,
      "halfBeatCount",
    ),
      halfBeatCount);
    (H.domain(
      Number.isFinite(beatsPerMinute) && beatsPerMinute > 0,
      "beatsPerMinute",
    ),
      beatsPerMinute);
    return { offsetSeconds: (halfBeatCount * 30) / beatsPerMinute };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { halfBeatCount: 7, beatsPerMinute: 120 },
  output: { offsetSeconds: 1.75 },
} satisfies ToolExample<Input, Output>;
export const danceCountHalfBeatTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/dance-count-half-beat-time-offset",
    title: "Dance Count Half Beat Time Offset",
    description:
      "Convert an explicit signed half-beat count to elapsed seconds at a supplied constant tempo.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        halfBeatCount: { type: "integer" },
        beatsPerMinute: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["halfBeatCount", "beatsPerMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetSeconds: { type: "number" } },
      required: ["offsetSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "halfBeatCount",
          label: "Half Beat Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beatsPerMinute",
          label: "Beats Per Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetSeconds",
          label: "Offset Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = danceCountHalfBeatTimeOffsetTool.execute;
export default danceCountHalfBeatTimeOffsetTool;
