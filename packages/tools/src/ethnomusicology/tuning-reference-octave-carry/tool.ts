import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly step: number;
  readonly octave: number;
  readonly stepsPerOctave: number;
};
export type Output = {
  readonly normalizedStep: number;
  readonly normalizedOctave: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    step: { type: "integer" },
    octave: { type: "integer" },
    stepsPerOctave: { type: "integer", minimum: 1 },
  },
  required: ["step", "octave", "stepsPerOctave"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedStep: { type: "integer" },
    normalizedOctave: { type: "integer" },
  },
  required: ["normalizedStep", "normalizedOctave"],
} as const;
/** Normalize supplied tuning-step/octave indices under a caller-defined division; no frequency or temperament table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { step, octave, stepsPerOctave } = request;
  const compute = (): Output => {
    H.integer(stepsPerOctave, 1);
    const s = BigInt(step),
      n = BigInt(stepsPerOctave),
      r = ((s % n) + n) % n;
    return {
      normalizedStep: Number(r),
      normalizedOctave: Number(BigInt(octave) + (s - r) / n),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { step: 14, octave: 4, stepsPerOctave: 12 },
  output: { normalizedStep: 2, normalizedOctave: 5 },
} satisfies ToolExample<Input, Output>;
export const tuningReferenceOctaveCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/tuning-reference-octave-carry",
    title: "Tuning Reference Octave Carry Tool",
    description:
      "Normalize supplied tuning-step/octave indices under a caller-defined division; no frequency or temperament table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        step: { type: "integer" },
        octave: { type: "integer" },
        stepsPerOctave: { type: "integer", minimum: 1 },
      },
      required: ["step", "octave", "stepsPerOctave"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedStep: { type: "integer" },
        normalizedOctave: { type: "integer" },
      },
      required: ["normalizedStep", "normalizedOctave"],
    },
    ports: {
      inputs: [
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "octave",
          label: "Octave",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stepsPerOctave",
          label: "Steps Per Octave",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "normalizedStep",
          label: "Normalized Step",
          valueType: { type: "integer" },
        },
        {
          id: "normalizedOctave",
          label: "Normalized Octave",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tuningReferenceOctaveCarryTool.execute;
export default tuningReferenceOctaveCarryTool;
