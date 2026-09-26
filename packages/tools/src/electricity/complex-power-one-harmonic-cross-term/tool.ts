import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voltageMagnitude: number;
  readonly currentMagnitude: number;
  readonly phaseDifference: number;
};
export type Output = { readonly active: number; readonly reactive: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltageMagnitude: { type: "number", minimum: 0 },
    currentMagnitude: { type: "number", minimum: 0 },
    phaseDifference: { type: "number" },
  },
  required: ["voltageMagnitude", "currentMagnitude", "phaseDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { active: { type: "number" }, reactive: { type: "number" } },
  required: ["active", "reactive"],
} as const;
/** Return P and Q for one matching-frequency RMS voltage/current harmonic with voltage-minus-current phase. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voltageMagnitude, currentMagnitude, phaseDifference } = request;
  const compute = (): Output => {
    H.domain(voltageMagnitude >= 0 && currentMagnitude >= 0);
    const apparent = voltageMagnitude * currentMagnitude;
    return {
      active: apparent * Math.cos(phaseDifference),
      reactive: apparent * Math.sin(phaseDifference),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voltageMagnitude: 10, currentMagnitude: 2, phaseDifference: 0 },
  output: { active: 20, reactive: 0 },
} satisfies ToolExample<Input, Output>;
export const complexPowerOneHarmonicCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/complex-power-one-harmonic-cross-term",
    title: "Complex Power One Harmonic Cross Term Tool",
    description:
      "Return P and Q for one matching-frequency RMS voltage/current harmonic with voltage-minus-current phase.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltageMagnitude: { type: "number", minimum: 0 },
        currentMagnitude: { type: "number", minimum: 0 },
        phaseDifference: { type: "number" },
      },
      required: ["voltageMagnitude", "currentMagnitude", "phaseDifference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { active: { type: "number" }, reactive: { type: "number" } },
      required: ["active", "reactive"],
    },
    ports: {
      inputs: [
        {
          id: "voltageMagnitude",
          label: "Voltage Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentMagnitude",
          label: "Current Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseDifference",
          label: "Phase Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "active", label: "Active", valueType: { type: "number" } },
        { id: "reactive", label: "Reactive", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = complexPowerOneHarmonicCrossTermTool.execute;
export default complexPowerOneHarmonicCrossTermTool;
