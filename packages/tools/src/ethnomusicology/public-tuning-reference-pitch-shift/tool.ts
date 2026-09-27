import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalReference: number;
  readonly targetReference: number;
  readonly noteFrequency: number;
};
export type Output = {
  readonly factor: number;
  readonly shiftedFrequency: number;
  readonly cents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalReference: { type: "number", exclusiveMinimum: 0 },
    targetReference: { type: "number", exclusiveMinimum: 0 },
    noteFrequency: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["originalReference", "targetReference", "noteFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factor: { type: "number" },
    shiftedFrequency: { type: "number" },
    cents: { type: "number" },
  },
  required: ["factor", "shiftedFrequency", "cents"],
} as const;
/** Calculate public tuning reference pitch shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalReference, targetReference, noteFrequency } = request;
  const compute = (): Output => {
    H.positive(originalReference);
    H.positive(targetReference);
    H.positive(noteFrequency);
    return {
      factor: targetReference / originalReference,
      shiftedFrequency: (noteFrequency * targetReference) / originalReference,
      cents: 1200 * Math.log2(targetReference / originalReference),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalReference: 440, targetReference: 442, noteFrequency: 660 },
  output: {
    factor: 1.0045454545454546,
    shiftedFrequency: 663,
    cents: 7.851415040126504,
  },
} satisfies ToolExample<Input, Output>;
export const publicTuningReferencePitchShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/public-tuning-reference-pitch-shift",
    title: "Public Tuning Reference Pitch Shift Tool",
    description:
      "Calculate public tuning reference pitch shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalReference: { type: "number", exclusiveMinimum: 0 },
        targetReference: { type: "number", exclusiveMinimum: 0 },
        noteFrequency: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["originalReference", "targetReference", "noteFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        factor: { type: "number" },
        shiftedFrequency: { type: "number" },
        cents: { type: "number" },
      },
      required: ["factor", "shiftedFrequency", "cents"],
    },
    ports: {
      inputs: [
        {
          id: "originalReference",
          label: "Original Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetReference",
          label: "Target Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "noteFrequency",
          label: "Note Frequency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
        {
          id: "shiftedFrequency",
          label: "Shifted Frequency",
          valueType: { type: "number" },
        },
        { id: "cents", label: "Cents", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicTuningReferencePitchShiftTool.execute;
export default publicTuningReferencePitchShiftTool;
