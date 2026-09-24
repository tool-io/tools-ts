import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labeledMass: number;
  readonly suppliedActiveFraction: number;
  readonly basisKnown: boolean;
};
export type Output = {
  readonly activeMassDefined: boolean;
  readonly activeMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labeledMass: { type: "number", minimum: 0 },
    suppliedActiveFraction: { type: "number", minimum: 0, maximum: 1 },
    basisKnown: { type: "boolean" },
  },
  required: ["labeledMass", "suppliedActiveFraction", "basisKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMassDefined: { type: "boolean" },
    activeMass: { type: "number" },
  },
  required: ["activeMassDefined", "activeMass"],
} as const;
/** Apply a caller-supplied mass-basis fraction to a label quantity, without deriving salt factors, dose or interchangeability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labeledMass, suppliedActiveFraction, basisKnown } = request;
  const compute = (): Output => {
    H.domain(labeledMass >= 0);
    H.probability(suppliedActiveFraction);
    return {
      activeMassDefined: basisKnown,
      activeMass: basisKnown ? labeledMass * suppliedActiveFraction : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labeledMass: 100, suppliedActiveFraction: 0.8, basisKnown: true },
  output: { activeMassDefined: true, activeMass: 80 },
} satisfies ToolExample<Input, Output>;
export const medicineStrengthMassBasisTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medicine-strength-mass-basis-token",
    title: "Medicine Strength Mass Basis Token Tool",
    description:
      "Apply a caller-supplied mass-basis fraction to a label quantity, without deriving salt factors, dose or interchangeability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labeledMass: { type: "number", minimum: 0 },
        suppliedActiveFraction: { type: "number", minimum: 0, maximum: 1 },
        basisKnown: { type: "boolean" },
      },
      required: ["labeledMass", "suppliedActiveFraction", "basisKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMassDefined: { type: "boolean" },
        activeMass: { type: "number" },
      },
      required: ["activeMassDefined", "activeMass"],
    },
    ports: {
      inputs: [
        {
          id: "labeledMass",
          label: "Labeled Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedActiveFraction",
          label: "Supplied Active Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basisKnown",
          label: "Basis Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "activeMassDefined",
          label: "Active Mass Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "activeMass",
          label: "Active Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineStrengthMassBasisTokenTool.execute;
export default medicineStrengthMassBasisTokenTool;
