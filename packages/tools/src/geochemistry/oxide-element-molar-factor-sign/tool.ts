import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oxideMoles: number;
  readonly atomsPerFormula: number;
  readonly suppliedMolarMass: number;
  readonly signedCorrection: number;
};
export type Output = {
  readonly elementMoles: number;
  readonly elementMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxideMoles: { type: "number", minimum: 0 },
    atomsPerFormula: { type: "integer", minimum: 1 },
    suppliedMolarMass: { type: "number", exclusiveMinimum: 0 },
    signedCorrection: { type: "number" },
  },
  required: [
    "oxideMoles",
    "atomsPerFormula",
    "suppliedMolarMass",
    "signedCorrection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementMoles: { type: "number" },
    elementMass: { type: "number" },
  },
  required: ["elementMoles", "elementMass"],
} as const;
/** Formal elemental inventory with supplied stoichiometry/molar mass and a signed correction; no oxide composition table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oxideMoles, atomsPerFormula, suppliedMolarMass, signedCorrection } =
    request;
  const compute = (): Output => {
    H.domain(oxideMoles >= 0);
    H.integer(atomsPerFormula, 1);
    H.positive(suppliedMolarMass);
    return {
      elementMoles: oxideMoles * atomsPerFormula + signedCorrection,
      elementMass:
        (oxideMoles * atomsPerFormula + signedCorrection) * suppliedMolarMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oxideMoles: 2,
    atomsPerFormula: 2,
    suppliedMolarMass: 10,
    signedCorrection: -1,
  },
  output: { elementMoles: 3, elementMass: 30 },
} satisfies ToolExample<Input, Output>;
export const oxideElementMolarFactorSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/oxide-element-molar-factor-sign",
    title: "Oxide Element Molar Factor Sign Tool",
    description:
      "Formal elemental inventory with supplied stoichiometry/molar mass and a signed correction; no oxide composition table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oxideMoles: { type: "number", minimum: 0 },
        atomsPerFormula: { type: "integer", minimum: 1 },
        suppliedMolarMass: { type: "number", exclusiveMinimum: 0 },
        signedCorrection: { type: "number" },
      },
      required: [
        "oxideMoles",
        "atomsPerFormula",
        "suppliedMolarMass",
        "signedCorrection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elementMoles: { type: "number" },
        elementMass: { type: "number" },
      },
      required: ["elementMoles", "elementMass"],
    },
    ports: {
      inputs: [
        {
          id: "oxideMoles",
          label: "Oxide Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "atomsPerFormula",
          label: "Atoms Per Formula",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMolarMass",
          label: "Supplied Molar Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedCorrection",
          label: "Signed Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elementMoles",
          label: "Element Moles",
          valueType: { type: "number" },
        },
        {
          id: "elementMass",
          label: "Element Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oxideElementMolarFactorSignTool.execute;
export default oxideElementMolarFactorSignTool;
