import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countedIncrements: number;
  readonly edgeFraction: number;
  readonly suppliedReferenceOffset: number;
};
export type Output = { readonly ageEquivalent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedIncrements: { type: "integer", minimum: 0 },
    edgeFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedReferenceOffset: { type: "number" },
  },
  required: ["countedIncrements", "edgeFraction", "suppliedReferenceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageEquivalent: { type: "number" } },
  required: ["ageEquivalent"],
} as const;
/** Increment-count bookkeeping with a supplied edge/reference convention, not biological age validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countedIncrements, edgeFraction, suppliedReferenceOffset } = request;
  const compute = (): Output => {
    H.integer(countedIncrements, 0);
    H.probability(edgeFraction);
    return {
      ageEquivalent: countedIncrements + edgeFraction + suppliedReferenceOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    countedIncrements: 3,
    edgeFraction: 0.5,
    suppliedReferenceOffset: -1,
  },
  output: { ageEquivalent: 2.5 },
} satisfies ToolExample<Input, Output>;
export const otolithEdgeageReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/otolith-edgeage-reference-offset",
    title: "Otolith Edgeage Reference Offset Tool",
    description:
      "Increment-count bookkeeping with a supplied edge/reference convention, not biological age validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedIncrements: { type: "integer", minimum: 0 },
        edgeFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedReferenceOffset: { type: "number" },
      },
      required: [
        "countedIncrements",
        "edgeFraction",
        "suppliedReferenceOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageEquivalent: { type: "number" } },
      required: ["ageEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "countedIncrements",
          label: "Counted Increments",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edgeFraction",
          label: "Edge Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceOffset",
          label: "Supplied Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ageEquivalent",
          label: "Age Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = otolithEdgeageReferenceOffsetTool.execute;
export default otolithEdgeageReferenceOffsetTool;
