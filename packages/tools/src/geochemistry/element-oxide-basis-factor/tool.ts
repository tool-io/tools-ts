import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oxideFormula: string;
  readonly elementSymbol: string;
  readonly elementAtoms: number;
  readonly elementAtomicMass: number;
  readonly otherAtomCounts: readonly number[];
  readonly otherAtomicMasses: readonly number[];
};
export type Output = {
  readonly elementMassFraction: number;
  readonly oxidePerElementFactor: number;
  readonly formulaKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxideFormula: { type: "string", maxLength: 8192 },
    elementSymbol: { type: "string", maxLength: 8192 },
    elementAtoms: { type: "integer", minimum: 1 },
    elementAtomicMass: { type: "number", exclusiveMinimum: 0 },
    otherAtomCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    otherAtomicMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: [
    "oxideFormula",
    "elementSymbol",
    "elementAtoms",
    "elementAtomicMass",
    "otherAtomCounts",
    "otherAtomicMasses",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementMassFraction: { type: "number" },
    oxidePerElementFactor: { type: "number" },
    formulaKey: { type: "string", maxLength: 8192 },
  },
  required: ["elementMassFraction", "oxidePerElementFactor", "formulaKey"],
} as const;
/** Derive one stoichiometric element/oxide mass multiplier from explicitly identified formula metadata and supplied atom counts/masses; no mineral identity or formula parsing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    oxideFormula,
    elementSymbol,
    elementAtoms,
    elementAtomicMass,
    otherAtomCounts,
    otherAtomicMasses,
  } = request;
  const compute = (): Output => {
    H.domain(oxideFormula.length > 0 && elementSymbol.length > 0);
    H.integer(elementAtoms, 1);
    H.positive(elementAtomicMass);
    H.sameLength(otherAtomCounts, otherAtomicMasses);
    H.domain(
      otherAtomCounts.every((x) => x >= 0) &&
        otherAtomicMasses.every((x) => x > 0),
    );
    const elementMass = elementAtoms * elementAtomicMass,
      totalMass = elementMass + H.dot(otherAtomCounts, otherAtomicMasses);
    H.positive(totalMass);
    return {
      elementMassFraction: elementMass / totalMass,
      oxidePerElementFactor: totalMass / elementMass,
      formulaKey: JSON.stringify([oxideFormula, elementSymbol]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oxideFormula: "Fe2O3",
    elementSymbol: "Fe",
    elementAtoms: 2,
    elementAtomicMass: 56,
    otherAtomCounts: [3],
    otherAtomicMasses: [16],
  },
  output: {
    elementMassFraction: 0.7,
    oxidePerElementFactor: 1.4285714285714286,
    formulaKey: '["Fe2O3","Fe"]',
  },
} satisfies ToolExample<Input, Output>;
export const elementOxideBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/element-oxide-basis-factor",
    title: "Element Oxide Basis Factor Tool",
    description:
      "Derive one stoichiometric element/oxide mass multiplier from explicitly identified formula metadata and supplied atom counts/masses; no mineral identity or formula parsing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oxideFormula: { type: "string", maxLength: 8192 },
        elementSymbol: { type: "string", maxLength: 8192 },
        elementAtoms: { type: "integer", minimum: 1 },
        elementAtomicMass: { type: "number", exclusiveMinimum: 0 },
        otherAtomCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        otherAtomicMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: [
        "oxideFormula",
        "elementSymbol",
        "elementAtoms",
        "elementAtomicMass",
        "otherAtomCounts",
        "otherAtomicMasses",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elementMassFraction: { type: "number" },
        oxidePerElementFactor: { type: "number" },
        formulaKey: { type: "string", maxLength: 8192 },
      },
      required: ["elementMassFraction", "oxidePerElementFactor", "formulaKey"],
    },
    ports: {
      inputs: [
        {
          id: "oxideFormula",
          label: "Oxide Formula",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elementSymbol",
          label: "Element Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elementAtoms",
          label: "Element Atoms",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "elementAtomicMass",
          label: "Element Atomic Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherAtomCounts",
          label: "Other Atom Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "otherAtomicMasses",
          label: "Other Atomic Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "elementMassFraction",
          label: "Element Mass Fraction",
          valueType: { type: "number" },
        },
        {
          id: "oxidePerElementFactor",
          label: "Oxide Per Element Factor",
          valueType: { type: "number" },
        },
        {
          id: "formulaKey",
          label: "Formula Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = elementOxideBasisFactorTool.execute;
export default elementOxideBasisFactorTool;
