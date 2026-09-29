import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preservedMass: number;
  readonly suppliedRetainedFraction: number;
  readonly freshReference: number;
};
export type Output = {
  readonly conditionalFreshMass: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedMass: { type: "number", minimum: 0 },
    suppliedRetainedFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
    freshReference: { type: "number", minimum: 0 },
  },
  required: ["preservedMass", "suppliedRetainedFraction", "freshReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalFreshMass: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["conditionalFreshMass", "referenceGap"],
} as const;
/** Use an explicitly supplied preservation mass-retention factor; no taxon-specific correction is invented. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preservedMass, suppliedRetainedFraction, freshReference } = request;
  const compute = (): Output => {
    H.domain(
      preservedMass >= 0 &&
        suppliedRetainedFraction > 0 &&
        suppliedRetainedFraction <= 1 &&
        freshReference >= 0,
    );
    return {
      conditionalFreshMass: preservedMass / suppliedRetainedFraction,
      referenceGap: preservedMass / suppliedRetainedFraction - freshReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preservedMass: 80,
    suppliedRetainedFraction: 0.8,
    freshReference: 90,
  },
  output: { conditionalFreshMass: 100, referenceGap: 10 },
} satisfies ToolExample<Input, Output>;
export const fishMassPreservationBaseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-mass-preservation-base-term",
    title: "Fish Mass Preservation Base Term Tool",
    description:
      "Use an explicitly supplied preservation mass-retention factor; no taxon-specific correction is invented.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preservedMass: { type: "number", minimum: 0 },
        suppliedRetainedFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
        freshReference: { type: "number", minimum: 0 },
      },
      required: ["preservedMass", "suppliedRetainedFraction", "freshReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalFreshMass: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["conditionalFreshMass", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "preservedMass",
          label: "Preserved Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetainedFraction",
          label: "Supplied Retained Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freshReference",
          label: "Fresh Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conditionalFreshMass",
          label: "Conditional Fresh Mass",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishMassPreservationBaseTermTool.execute;
export default fishMassPreservationBaseTermTool;
