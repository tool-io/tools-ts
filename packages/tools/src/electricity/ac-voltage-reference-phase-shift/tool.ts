import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly magnitude: number;
  readonly phaseDegrees: number;
  readonly referenceShiftDegrees: number;
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
    referenceShiftDegrees: { type: "number" },
  },
  required: ["magnitude", "phaseDegrees", "referenceShiftDegrees"],
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
/** Change a sinusoidal phasor reference by subtracting an explicit phase shift and wrapping to [0,360) degrees. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { magnitude, phaseDegrees, referenceShiftDegrees } = input;
  const compute = (): Output => {
    H.domain(magnitude >= 0);
    return {
      magnitude,
      phaseDegrees: H.mod(phaseDegrees - referenceShiftDegrees, 360),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { magnitude: 120, phaseDegrees: 30, referenceShiftDegrees: 90 },
  output: { magnitude: 120, phaseDegrees: 300 },
} satisfies ToolExample<Input, Output>;
export const acVoltageReferencePhaseShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/ac-voltage-reference-phase-shift",
    title: "AC Voltage Reference Phase Shift Tool",
    description:
      "Change a sinusoidal phasor reference by subtracting an explicit phase shift and wrapping to [0,360) degrees.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        magnitude: { type: "number", minimum: 0 },
        phaseDegrees: { type: "number" },
        referenceShiftDegrees: { type: "number" },
      },
      required: ["magnitude", "phaseDegrees", "referenceShiftDegrees"],
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
        {
          id: "referenceShiftDegrees",
          label: "Reference Shift Degrees",
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
export const run = acVoltageReferencePhaseShiftTool.execute;
export default acVoltageReferencePhaseShiftTool;
