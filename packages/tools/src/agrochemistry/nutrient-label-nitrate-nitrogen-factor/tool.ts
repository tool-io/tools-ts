import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nitrateMass: number;
  readonly nitrogenAtomicMass: number;
  readonly nitrateMolarMass: number;
  readonly nitrogenAtoms: number;
};
export type Output = { readonly nitrogenMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nitrateMass: { type: "number", minimum: 0 },
    nitrogenAtomicMass: { type: "number", exclusiveMinimum: 0 },
    nitrateMolarMass: { type: "number", exclusiveMinimum: 0 },
    nitrogenAtoms: { type: "integer", minimum: 1 },
  },
  required: [
    "nitrateMass",
    "nitrogenAtomicMass",
    "nitrateMolarMass",
    "nitrogenAtoms",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nitrogenMass: { type: "number" } },
  required: ["nitrogenMass"],
} as const;
/** Calculate nutrient label nitrate nitrogen factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nitrateMass, nitrogenAtomicMass, nitrateMolarMass, nitrogenAtoms } =
    request;
  const compute = (): Output => {
    H.domain(nitrateMass >= 0);
    H.positive(nitrogenAtomicMass);
    H.positive(nitrateMolarMass);
    H.integer(nitrogenAtoms, 1);
    return {
      nitrogenMass:
        (nitrateMass * nitrogenAtomicMass * nitrogenAtoms) / nitrateMolarMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nitrateMass: 62,
    nitrogenAtomicMass: 14,
    nitrateMolarMass: 62,
    nitrogenAtoms: 1,
  },
  output: { nitrogenMass: 14 },
} satisfies ToolExample<Input, Output>;
export const nutrientLabelNitrateNitrogenFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/nutrient-label-nitrate-nitrogen-factor",
    title: "Nutrient Label Nitrate Nitrogen Factor Tool",
    description:
      "Calculate nutrient label nitrate nitrogen factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nitrateMass: { type: "number", minimum: 0 },
        nitrogenAtomicMass: { type: "number", exclusiveMinimum: 0 },
        nitrateMolarMass: { type: "number", exclusiveMinimum: 0 },
        nitrogenAtoms: { type: "integer", minimum: 1 },
      },
      required: [
        "nitrateMass",
        "nitrogenAtomicMass",
        "nitrateMolarMass",
        "nitrogenAtoms",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nitrogenMass: { type: "number" } },
      required: ["nitrogenMass"],
    },
    ports: {
      inputs: [
        {
          id: "nitrateMass",
          label: "Nitrate Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nitrogenAtomicMass",
          label: "Nitrogen Atomic Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nitrateMolarMass",
          label: "Nitrate Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nitrogenAtoms",
          label: "Nitrogen Atoms",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nitrogenMass",
          label: "Nitrogen Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientLabelNitrateNitrogenFactorTool.execute;
export default nutrientLabelNitrateNitrogenFactorTool;
