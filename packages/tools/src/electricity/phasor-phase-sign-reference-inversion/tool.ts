import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magnitude: number;
  readonly phaseDegrees: number;
};
export type Output = {
  readonly magnitude: number;
  readonly phaseDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0 },
    phaseDegrees: { type: "number" },
  },
  required: ["magnitude", "phaseDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number" },
    phaseDegrees: { type: "number" },
  },
  required: ["magnitude", "phaseDegrees"],
} as const;
/** Reverse the polarity reference of a phasor by a half-turn while preserving nonnegative magnitude. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { magnitude, phaseDegrees } = input;
  const compute = (): Output => {
    H.domain(magnitude >= 0);
    return { magnitude, phaseDegrees: H.mod(phaseDegrees + 180, 360) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { magnitude: 5, phaseDegrees: 30 },
  output: { magnitude: 5, phaseDegrees: 210 },
} satisfies ToolExample<Input, Output>;
export const phasorPhaseSignReferenceInversionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/phasor-phase-sign-reference-inversion",
    title: "Phasor Phase Sign Reference Inversion Tool",
    description:
      "Reverse the polarity reference of a phasor by a half-turn while preserving nonnegative magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number", minimum: 0 },
        phaseDegrees: { type: "number" },
      },
      required: ["magnitude", "phaseDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number" },
        phaseDegrees: { type: "number" },
      },
      required: ["magnitude", "phaseDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "magnitude",
          label: "Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseDegrees",
          label: "Phase Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
        {
          id: "phaseDegrees",
          label: "Phase Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = phasorPhaseSignReferenceInversionTool.execute;
export default phasorPhaseSignReferenceInversionTool;
