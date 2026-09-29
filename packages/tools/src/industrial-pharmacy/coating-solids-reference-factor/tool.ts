import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetCoatingMass: number;
  readonly solidsFraction: number;
  readonly referenceDryMass: number;
};
export type Output = {
  readonly dryMass: number;
  readonly referenceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetCoatingMass: { type: "number", minimum: 0 },
    solidsFraction: { type: "number", minimum: 0, maximum: 1 },
    referenceDryMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetCoatingMass", "solidsFraction", "referenceDryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    referenceRatio: { type: "number" },
  },
  required: ["dryMass", "referenceRatio"],
} as const;
/** Convert supplied wet coating mass to dry-solids equivalent under an explicit mass fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetCoatingMass, solidsFraction, referenceDryMass } = request;
  const compute = (): Output => {
    H.domain(wetCoatingMass >= 0);
    H.probability(solidsFraction);
    H.positive(referenceDryMass);
    return {
      dryMass: wetCoatingMass * solidsFraction,
      referenceRatio: (wetCoatingMass * solidsFraction) / referenceDryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetCoatingMass: 100, solidsFraction: 0.2, referenceDryMass: 10 },
  output: { dryMass: 20, referenceRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const coatingSolidsReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/coating-solids-reference-factor",
    title: "Coating Solids Reference Factor Tool",
    description:
      "Convert supplied wet coating mass to dry-solids equivalent under an explicit mass fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetCoatingMass: { type: "number", minimum: 0 },
        solidsFraction: { type: "number", minimum: 0, maximum: 1 },
        referenceDryMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetCoatingMass", "solidsFraction", "referenceDryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        referenceRatio: { type: "number" },
      },
      required: ["dryMass", "referenceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "wetCoatingMass",
          label: "Wet Coating Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidsFraction",
          label: "Solids Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDryMass",
          label: "Reference Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coatingSolidsReferenceFactorTool.execute;
export default coatingSolidsReferenceFactorTool;
