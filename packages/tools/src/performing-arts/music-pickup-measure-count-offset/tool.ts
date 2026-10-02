import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullMeasureBeats: number;
  readonly pickupBeats: number;
  readonly measureNumber: number;
  readonly beatInMeasure: number;
};
export type Output = { readonly absoluteBeat: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullMeasureBeats: { type: "number", exclusiveMinimum: 0 },
    pickupBeats: { type: "number", minimum: 0 },
    measureNumber: { type: "integer", minimum: 1 },
    beatInMeasure: { type: "number", minimum: 0 },
  },
  required: [
    "fullMeasureBeats",
    "pickupBeats",
    "measureNumber",
    "beatInMeasure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { absoluteBeat: { type: "number" } },
  required: ["absoluteBeat"],
} as const;
/** Zero-based beat offset from the start of the pickup; measure 1 is the first full measure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullMeasureBeats, pickupBeats, measureNumber, beatInMeasure } =
    request;
  const compute = (): Output => {
    H.positive(fullMeasureBeats);
    H.domain(
      pickupBeats >= 0 &&
        pickupBeats < fullMeasureBeats &&
        beatInMeasure >= 0 &&
        beatInMeasure < fullMeasureBeats,
    );
    H.integer(measureNumber, 1);
    return {
      absoluteBeat:
        pickupBeats + (measureNumber - 1) * fullMeasureBeats + beatInMeasure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fullMeasureBeats: 4,
    pickupBeats: 1,
    measureNumber: 2,
    beatInMeasure: 0,
  },
  output: { absoluteBeat: 5 },
} satisfies ToolExample<Input, Output>;
export const musicPickupMeasureCountOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/music-pickup-measure-count-offset",
    title: "Music Pickup Measure Count Offset Tool",
    description:
      "Zero-based beat offset from the start of the pickup; measure 1 is the first full measure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullMeasureBeats: { type: "number", exclusiveMinimum: 0 },
        pickupBeats: { type: "number", minimum: 0 },
        measureNumber: { type: "integer", minimum: 1 },
        beatInMeasure: { type: "number", minimum: 0 },
      },
      required: [
        "fullMeasureBeats",
        "pickupBeats",
        "measureNumber",
        "beatInMeasure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { absoluteBeat: { type: "number" } },
      required: ["absoluteBeat"],
    },
    ports: {
      inputs: [
        {
          id: "fullMeasureBeats",
          label: "Full Measure Beats",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pickupBeats",
          label: "Pickup Beats",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measureNumber",
          label: "Measure Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "beatInMeasure",
          label: "Beat In Measure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteBeat",
          label: "Absolute Beat",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = musicPickupMeasureCountOffsetTool.execute;
export default musicPickupMeasureCountOffsetTool;
