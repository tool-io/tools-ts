import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voltageReal: number;
  readonly voltageImag: number;
  readonly currentReal: number;
  readonly currentImag: number;
};
export type Output = { readonly active: number; readonly reactive: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltageReal: { type: "number" },
    voltageImag: { type: "number" },
    currentReal: { type: "number" },
    currentImag: { type: "number" },
  },
  required: ["voltageReal", "voltageImag", "currentReal", "currentImag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { active: { type: "number" }, reactive: { type: "number" } },
  required: ["active", "reactive"],
} as const;
/** Compute complex power V*conj(I) from RMS rectangular phasors using the passive sign convention. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { voltageReal, voltageImag, currentReal, currentImag } = input;
  const compute = (): Output => {
    return {
      active: voltageReal * currentReal + voltageImag * currentImag,
      reactive: voltageImag * currentReal - voltageReal * currentImag,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { voltageReal: 2, voltageImag: 1, currentReal: 3, currentImag: -1 },
  output: { active: 5, reactive: 5 },
} satisfies ToolExample<Input, Output>;
export const phasorConjugatePowerSignCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/phasor-conjugate-power-sign-check",
    title: "Phasor Conjugate Power Sign Check Tool",
    description:
      "Compute complex power V*conj(I) from RMS rectangular phasors using the passive sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltageReal: { type: "number" },
        voltageImag: { type: "number" },
        currentReal: { type: "number" },
        currentImag: { type: "number" },
      },
      required: ["voltageReal", "voltageImag", "currentReal", "currentImag"],
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
          id: "voltageReal",
          label: "Voltage Real",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voltageImag",
          label: "Voltage Imag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentReal",
          label: "Current Real",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentImag",
          label: "Current Imag",
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
export const run = phasorConjugatePowerSignCheckTool.execute;
export default phasorConjugatePowerSignCheckTool;
