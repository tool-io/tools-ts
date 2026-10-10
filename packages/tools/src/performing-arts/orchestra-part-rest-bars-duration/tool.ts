import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restBars: number;
  readonly beatsPerBar: number;
  readonly beatsPerMinute: number;
};
export type Output = { readonly durationSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restBars: { type: "integer", minimum: 0 },
    beatsPerBar: { type: "number", exclusiveMinimum: 0 },
    beatsPerMinute: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["restBars", "beatsPerBar", "beatsPerMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationSeconds: { type: "number" } },
  required: ["durationSeconds"],
} as const;
/** Convert an explicit constant-meter rest-bar count to duration at a supplied constant tempo without interpreting notation changes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restBars, beatsPerBar, beatsPerMinute } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(restBars) &&
        restBars >= 0 &&
        restBars <= Number.MAX_SAFE_INTEGER,
      "restBars",
    ),
      restBars);
    (H.domain(Number.isFinite(beatsPerBar) && beatsPerBar > 0, "beatsPerBar"),
      beatsPerBar);
    (H.domain(
      Number.isFinite(beatsPerMinute) && beatsPerMinute > 0,
      "beatsPerMinute",
    ),
      beatsPerMinute);
    return {
      durationSeconds: ((restBars * beatsPerBar) / beatsPerMinute) * 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { restBars: 8, beatsPerBar: 4, beatsPerMinute: 120 },
  output: { durationSeconds: 16 },
} satisfies ToolExample<Input, Output>;
export const orchestraPartRestBarsDurationTool = H.defineSchemaCalculation<
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
    id: "performing-arts/orchestra-part-rest-bars-duration",
    title: "Orchestra Part Rest Bars Duration",
    description:
      "Convert an explicit constant-meter rest-bar count to duration at a supplied constant tempo without interpreting notation changes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restBars: { type: "integer", minimum: 0 },
        beatsPerBar: { type: "number", exclusiveMinimum: 0 },
        beatsPerMinute: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["restBars", "beatsPerBar", "beatsPerMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationSeconds: { type: "number" } },
      required: ["durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "restBars",
          label: "Rest Bars",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beatsPerBar",
          label: "Beats Per Bar",
          required: true,
          valueType: { type: "number" },
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
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orchestraPartRestBarsDurationTool.execute;
export default orchestraPartRestBarsDurationTool;
