import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dilutedAbsorbance: number;
  readonly dilutionFactor: number;
  readonly referenceAbsorbance: number;
};
export type Output = {
  readonly recoveredAbsorbance: number;
  readonly recovery: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dilutedAbsorbance: { type: "number" },
    dilutionFactor: { type: "number", minimum: 1 },
    referenceAbsorbance: { type: "number" },
  },
  required: ["dilutedAbsorbance", "dilutionFactor", "referenceAbsorbance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveredAbsorbance: { type: "number" },
    recovery: { type: "number" },
  },
  required: ["recoveredAbsorbance", "recovery"],
} as const;
/** Calculate diluted absorbance recovery factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dilutedAbsorbance, dilutionFactor, referenceAbsorbance } = request;
  const compute = (): Output => {
    H.domain(dilutionFactor >= 1);
    H.domain(referenceAbsorbance !== 0);
    return {
      recoveredAbsorbance: dilutedAbsorbance * dilutionFactor,
      recovery: (dilutedAbsorbance * dilutionFactor) / referenceAbsorbance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dilutedAbsorbance: 0.2,
    dilutionFactor: 5,
    referenceAbsorbance: 0.8,
  },
  output: { recoveredAbsorbance: 1, recovery: 1.25 },
} satisfies ToolExample<Input, Output>;
export const dilutedAbsorbanceRecoveryFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/diluted-absorbance-recovery-factor",
    title: "Diluted Absorbance Recovery Factor Tool",
    description:
      "Calculate diluted absorbance recovery factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dilutedAbsorbance: { type: "number" },
        dilutionFactor: { type: "number", minimum: 1 },
        referenceAbsorbance: { type: "number" },
      },
      required: ["dilutedAbsorbance", "dilutionFactor", "referenceAbsorbance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveredAbsorbance: { type: "number" },
        recovery: { type: "number" },
      },
      required: ["recoveredAbsorbance", "recovery"],
    },
    ports: {
      inputs: [
        {
          id: "dilutedAbsorbance",
          label: "Diluted Absorbance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAbsorbance",
          label: "Reference Absorbance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveredAbsorbance",
          label: "Recovered Absorbance",
          valueType: { type: "number" },
        },
        { id: "recovery", label: "Recovery", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dilutedAbsorbanceRecoveryFactorTool.execute;
export default dilutedAbsorbanceRecoveryFactorTool;
