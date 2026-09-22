import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerOne: number;
  readonly markerTwo: number;
  readonly suppliedScale: number;
  readonly referenceLength: number;
};
export type Output = {
  readonly gaugeLength: number;
  readonly signedStrain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerOne: { type: "number" },
    markerTwo: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["markerOne", "markerTwo", "suppliedScale", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaugeLength: { type: "number" },
    signedStrain: { type: "number" },
  },
  required: ["gaugeLength", "signedStrain"],
} as const;
/** Supplied bench gauge geometry and engineering strain without tissue-property inference or patient guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerOne, markerTwo, suppliedScale, referenceLength } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    H.positive(referenceLength);
    return {
      gaugeLength: Math.abs(markerTwo - markerOne) * suppliedScale,
      signedStrain:
        (Math.abs(markerTwo - markerOne) * suppliedScale - referenceLength) /
        referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    markerOne: 10,
    markerTwo: 30,
    suppliedScale: 0.5,
    referenceLength: 8,
  },
  output: { gaugeLength: 10, signedStrain: 0.25 },
} satisfies ToolExample<Input, Output>;
export const tissueSampleGaugeLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/tissue-sample-gauge-length",
    title: "Tissue Sample Gauge Length Tool",
    description:
      "Supplied bench gauge geometry and engineering strain without tissue-property inference or patient guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerOne: { type: "number" },
        markerTwo: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["markerOne", "markerTwo", "suppliedScale", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaugeLength: { type: "number" },
        signedStrain: { type: "number" },
      },
      required: ["gaugeLength", "signedStrain"],
    },
    ports: {
      inputs: [
        {
          id: "markerOne",
          label: "Marker One",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markerTwo",
          label: "Marker Two",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gaugeLength",
          label: "Gauge Length",
          valueType: { type: "number" },
        },
        {
          id: "signedStrain",
          label: "Signed Strain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueSampleGaugeLengthTool.execute;
export default tissueSampleGaugeLengthTool;
