import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly suppliedPurityFraction: number;
  readonly purityKnown: boolean;
};
export type Output = {
  readonly pureMassDefined: boolean;
  readonly pureMass: number;
  readonly otherMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    suppliedPurityFraction: { type: "number", minimum: 0, maximum: 1 },
    purityKnown: { type: "boolean" },
  },
  required: ["grossMass", "suppliedPurityFraction", "purityKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pureMassDefined: { type: "boolean" },
    pureMass: { type: "number" },
    otherMass: { type: "number" },
  },
  required: ["pureMassDefined", "pureMass", "otherMass"],
} as const;
/** Use a supplied mass-basis alloy purity label and preserve unknown composition with a flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, suppliedPurityFraction, purityKnown } = request;
  const compute = (): Output => {
    H.domain(grossMass >= 0);
    H.probability(suppliedPurityFraction);
    return {
      pureMassDefined: purityKnown,
      pureMass: purityKnown ? grossMass * suppliedPurityFraction : 0,
      otherMass: purityKnown ? grossMass * (1 - suppliedPurityFraction) : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 10, suppliedPurityFraction: 0.8, purityKnown: true },
  output: { pureMassDefined: true, pureMass: 8, otherMass: 1.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const alloyPurityLabelBasisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/alloy-purity-label-basis-flag",
    title: "Alloy Purity Label Basis Flag Tool",
    description:
      "Use a supplied mass-basis alloy purity label and preserve unknown composition with a flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", minimum: 0 },
        suppliedPurityFraction: { type: "number", minimum: 0, maximum: 1 },
        purityKnown: { type: "boolean" },
      },
      required: ["grossMass", "suppliedPurityFraction", "purityKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pureMassDefined: { type: "boolean" },
        pureMass: { type: "number" },
        otherMass: { type: "number" },
      },
      required: ["pureMassDefined", "pureMass", "otherMass"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPurityFraction",
          label: "Supplied Purity Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purityKnown",
          label: "Purity Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "pureMassDefined",
          label: "Pure Mass Defined",
          valueType: { type: "boolean" },
        },
        { id: "pureMass", label: "Pure Mass", valueType: { type: "number" } },
        { id: "otherMass", label: "Other Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = alloyPurityLabelBasisFlagTool.execute;
export default alloyPurityLabelBasisFlagTool;
