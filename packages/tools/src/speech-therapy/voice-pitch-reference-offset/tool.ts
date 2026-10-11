import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredHertz: number;
  readonly referenceHertz: number;
};
export type Output = {
  readonly hertzDifference: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredHertz: { type: "number", exclusiveMinimum: 0 },
    referenceHertz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredHertz", "referenceHertz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hertzDifference: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["hertzDifference", "ratio"],
} as const;
/** Compare explicit voice frequencies with a supplied reference without estimating pitch or choosing a therapeutic target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredHertz, referenceHertz } = request;
  const compute = (): Output => {
    (H.domain(measuredHertz > 0, "measuredHertz"), measuredHertz);
    (H.domain(referenceHertz > 0, "referenceHertz"), referenceHertz);
    return {
      hertzDifference: measuredHertz - referenceHertz,
      ratio: measuredHertz / referenceHertz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredHertz: 220, referenceHertz: 200 },
  output: { hertzDifference: 20, ratio: 1.1 },
} satisfies ToolExample<Input, Output>;
export const voicePitchReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/voice-pitch-reference-offset",
    title: "Voice Pitch Reference Offset",
    description:
      "Compare explicit voice frequencies with a supplied reference without estimating pitch or choosing a therapeutic target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredHertz: { type: "number", exclusiveMinimum: 0 },
        referenceHertz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredHertz", "referenceHertz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hertzDifference: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["hertzDifference", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "measuredHertz",
          label: "Measured Hertz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHertz",
          label: "Reference Hertz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "hertzDifference",
          label: "Hertz Difference",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = voicePitchReferenceOffsetTool.execute;
export default voicePitchReferenceOffsetTool;
