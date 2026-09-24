import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molarCapacity: number;
  readonly molarMass: number;
};
export type Output = { readonly specificCapacity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molarCapacity: { type: "number" },
    molarMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molarCapacity", "molarMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specificCapacity: { type: "number" } },
  required: ["specificCapacity"],
} as const;
/** Convert joules per mole kelvin to joules per kilogram kelvin with molar mass in kilograms per mole. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { molarCapacity, molarMass } = input;
  const compute = (): Output => {
    H.positive(molarMass);
    return { specificCapacity: molarCapacity / molarMass };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { molarCapacity: 75, molarMass: 0.025 },
  output: { specificCapacity: 3000 },
} satisfies ToolExample<Input, Output>;
export const molarThermalCapacityMassBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/molar-thermal-capacity-mass-basis",
    title: "Molar Thermal Capacity Mass Basis Tool",
    description:
      "Convert joules per mole kelvin to joules per kilogram kelvin with molar mass in kilograms per mole.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molarCapacity: { type: "number" },
        molarMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["molarCapacity", "molarMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { specificCapacity: { type: "number" } },
      required: ["specificCapacity"],
    },
    ports: {
      inputs: [
        {
          id: "molarCapacity",
          label: "Molar Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "molarMass",
          label: "Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "specificCapacity",
          label: "Specific Capacity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molarThermalCapacityMassBasisTool.execute;
export default molarThermalCapacityMassBasisTool;
