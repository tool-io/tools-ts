import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly referenceConcentration: number;
  readonly stoichiometricPower: number;
};
export type Output = {
  readonly activityProxy: number;
  readonly quotientFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", exclusiveMinimum: 0 },
    referenceConcentration: { type: "number", exclusiveMinimum: 0 },
    stoichiometricPower: { type: "number" },
  },
  required: ["concentration", "referenceConcentration", "stoichiometricPower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityProxy: { type: "number" },
    quotientFactor: { type: "number" },
  },
  required: ["activityProxy", "quotientFactor"],
} as const;
/** Dimensionless ideal concentration activity raised to a supplied stoichiometric exponent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, referenceConcentration, stoichiometricPower } =
    request;
  const compute = (): Output => {
    H.positive(concentration);
    H.positive(referenceConcentration);
    return {
      activityProxy: concentration / referenceConcentration,
      quotientFactor:
        (concentration / referenceConcentration) ** stoichiometricPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentration: 2,
    referenceConcentration: 1,
    stoichiometricPower: -2,
  },
  output: { activityProxy: 2, quotientFactor: 0.25 },
} satisfies ToolExample<Input, Output>;
export const biochemicalStandardStateConcentrationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/biochemical-standard-state-concentration-factor",
      title: "Biochemical Standard State Concentration Factor Tool",
      description:
        "Dimensionless ideal concentration activity raised to a supplied stoichiometric exponent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concentration: { type: "number", exclusiveMinimum: 0 },
          referenceConcentration: { type: "number", exclusiveMinimum: 0 },
          stoichiometricPower: { type: "number" },
        },
        required: [
          "concentration",
          "referenceConcentration",
          "stoichiometricPower",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityProxy: { type: "number" },
          quotientFactor: { type: "number" },
        },
        required: ["activityProxy", "quotientFactor"],
      },
      ports: {
        inputs: [
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceConcentration",
            label: "Reference Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stoichiometricPower",
            label: "Stoichiometric Power",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activityProxy",
            label: "Activity Proxy",
            valueType: { type: "number" },
          },
          {
            id: "quotientFactor",
            label: "Quotient Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biochemicalStandardStateConcentrationFactorTool.execute;
export default biochemicalStandardStateConcentrationFactorTool;
