import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly masses: readonly number[];
  readonly fractions: readonly number[];
  readonly recoveryFraction: number;
};
export type Output = {
  readonly inputMass: number;
  readonly constituentMass: number;
  readonly recoveredConstituent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    masses: { type: "array", maxItems: 256, items: { type: "number" } },
    fractions: { type: "array", maxItems: 256, items: { type: "number" } },
    recoveryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["masses", "fractions", "recoveryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number" },
    constituentMass: { type: "number" },
    recoveredConstituent: { type: "number" },
  },
  required: ["inputMass", "constituentMass", "recoveredConstituent"],
} as const;
/** Calculate oral surgery laboratory alloy mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { masses, fractions, recoveryFraction } = request;
  const compute = (): Output => {
    H.sameLength(masses, fractions);
    H.domain(
      masses.every((x) => x >= 0) && fractions.every((x) => x >= 0 && x <= 1),
    );
    H.probability(recoveryFraction);
    return {
      inputMass: masses.reduce((a, b) => a + b, 0),
      constituentMass: H.dot(masses, fractions),
      recoveredConstituent: H.dot(masses, fractions) * recoveryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { masses: [20, 30], fractions: [0.5, 0.8], recoveryFraction: 0.9 },
  output: { inputMass: 50, constituentMass: 34, recoveredConstituent: 30.6 },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryLaboratoryAlloyMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/oral-surgery-laboratory-alloy-mass-term",
    title: "Oral Surgery Laboratory Alloy Mass Term Tool",
    description:
      "Calculate oral surgery laboratory alloy mass term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        masses: { type: "array", maxItems: 256, items: { type: "number" } },
        fractions: { type: "array", maxItems: 256, items: { type: "number" } },
        recoveryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["masses", "fractions", "recoveryFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number" },
        constituentMass: { type: "number" },
        recoveredConstituent: { type: "number" },
      },
      required: ["inputMass", "constituentMass", "recoveredConstituent"],
    },
    ports: {
      inputs: [
        {
          id: "masses",
          label: "Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "fractions",
          label: "Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "recoveryFraction",
          label: "Recovery Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "inputMass", label: "Input Mass", valueType: { type: "number" } },
        {
          id: "constituentMass",
          label: "Constituent Mass",
          valueType: { type: "number" },
        },
        {
          id: "recoveredConstituent",
          label: "Recovered Constituent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralSurgeryLaboratoryAlloyMassTermTool.execute;
export default oralSurgeryLaboratoryAlloyMassTermTool;
