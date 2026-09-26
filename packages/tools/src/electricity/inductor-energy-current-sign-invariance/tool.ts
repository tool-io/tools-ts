import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inductance: number; readonly current: number };
export type Output = {
  readonly energy: number;
  readonly reversedEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inductance: { type: "number", minimum: 0 },
    current: { type: "number" },
  },
  required: ["inductance", "current"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: { type: "number" },
    reversedEnergy: { type: "number" },
  },
  required: ["energy", "reversedEnergy"],
} as const;
/** Compare ideal inductor stored energy before and after reversing current polarity. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { inductance, current } = input;
  const compute = (): Output => {
    H.domain(inductance >= 0);
    const energy = 0.5 * inductance * current * current;
    return { energy, reversedEnergy: energy };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inductance: 2, current: -3 },
  output: { energy: 9, reversedEnergy: 9 },
} satisfies ToolExample<Input, Output>;
export const inductorEnergyCurrentSignInvarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/inductor-energy-current-sign-invariance",
      title: "Inductor Energy Current Sign Invariance Tool",
      description:
        "Compare ideal inductor stored energy before and after reversing current polarity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inductance: { type: "number", minimum: 0 },
          current: { type: "number" },
        },
        required: ["inductance", "current"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          energy: { type: "number" },
          reversedEnergy: { type: "number" },
        },
        required: ["energy", "reversedEnergy"],
      },
      ports: {
        inputs: [
          {
            id: "inductance",
            label: "Inductance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "current",
            label: "Current",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "energy", label: "Energy", valueType: { type: "number" } },
          {
            id: "reversedEnergy",
            label: "Reversed Energy",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = inductorEnergyCurrentSignInvarianceTool.execute;
export default inductorEnergyCurrentSignInvarianceTool;
