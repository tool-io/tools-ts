import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedVolume: number;
  readonly sourceToTargetFactor: number;
};
export type Output = { readonly convertedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVolume: { type: "number", minimum: 0 },
    sourceToTargetFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedVolume", "sourceToTargetFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedVolume: { type: "number" } },
  required: ["convertedVolume"],
} as const;
/** Convert a supplied diary volume under an explicit unit factor without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedVolume, sourceToTargetFactor } = request;
  const compute = (): Output => {
    H.domain(recordedVolume >= 0);
    H.positive(sourceToTargetFactor);
    return { convertedVolume: recordedVolume * sourceToTargetFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedVolume: 250, sourceToTargetFactor: 0.001 },
  output: { convertedVolume: 0.25 },
} satisfies ToolExample<Input, Output>;
export const diaryEventVolumeUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/diary-event-volume-unit-factor",
    title: "Diary Event Volume Unit Factor Tool",
    description:
      "Convert a supplied diary volume under an explicit unit factor without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedVolume: { type: "number", minimum: 0 },
        sourceToTargetFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedVolume", "sourceToTargetFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedVolume: { type: "number" } },
      required: ["convertedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "recordedVolume",
          label: "Recorded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceToTargetFactor",
          label: "Source To Target Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedVolume",
          label: "Converted Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diaryEventVolumeUnitFactorTool.execute;
export default diaryEventVolumeUnitFactorTool;
