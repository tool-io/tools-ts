import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialProteinMass: number;
  readonly recoveredProteinMass: number;
};
export type Output = {
  readonly recoveryFraction: number;
  readonly recoveryPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialProteinMass: { type: "number", exclusiveMinimum: 0 },
    recoveredProteinMass: { type: "number", minimum: 0 },
  },
  required: ["initialProteinMass", "recoveredProteinMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveryFraction: { type: "number" },
    recoveryPercent: { type: "number" },
  },
  required: ["recoveryFraction", "recoveryPercent"],
} as const;
/** Express a supplied protein mass recovery on fraction and percent scales under a closed mass-balance assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialProteinMass, recoveredProteinMass } = request;
  const compute = (): Output => {
    (H.domain(initialProteinMass > 0, "initialProteinMass"),
      initialProteinMass);
    H.domain(
      recoveredProteinMass >= 0 && recoveredProteinMass <= initialProteinMass,
      "recoveredProteinMass",
    );
    return {
      recoveryFraction: recoveredProteinMass / initialProteinMass,
      recoveryPercent: (100 * recoveredProteinMass) / initialProteinMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialProteinMass: 80, recoveredProteinMass: 60 },
  output: { recoveryFraction: 0.75, recoveryPercent: 75 },
} satisfies ToolExample<Input, Output>;
export const proteinRecoveryFractionPercentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/protein-recovery-fraction-percent",
    title: "Protein Recovery Fraction Percent Tool",
    description:
      "Express a supplied protein mass recovery on fraction and percent scales under a closed mass-balance assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialProteinMass: { type: "number", exclusiveMinimum: 0 },
        recoveredProteinMass: { type: "number", minimum: 0 },
      },
      required: ["initialProteinMass", "recoveredProteinMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveryFraction: { type: "number" },
        recoveryPercent: { type: "number" },
      },
      required: ["recoveryFraction", "recoveryPercent"],
    },
    ports: {
      inputs: [
        {
          id: "initialProteinMass",
          label: "Initial Protein Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredProteinMass",
          label: "Recovered Protein Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          valueType: { type: "number" },
        },
        {
          id: "recoveryPercent",
          label: "Recovery Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinRecoveryFractionPercentTool.execute;
export default proteinRecoveryFractionPercentTool;
