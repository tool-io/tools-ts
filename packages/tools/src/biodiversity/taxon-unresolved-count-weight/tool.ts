import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resolvedCount: number;
  readonly unresolvedCount: number;
  readonly suppliedWeight: number;
};
export type Output = {
  readonly weightedCount: number;
  readonly unresolvedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resolvedCount: { type: "integer", minimum: 0 },
    unresolvedCount: { type: "integer", minimum: 0 },
    suppliedWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["resolvedCount", "unresolvedCount", "suppliedWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedCount: { type: "number" },
    unresolvedContribution: { type: "number" },
  },
  required: ["weightedCount", "unresolvedContribution"],
} as const;
/** Calculate taxon unresolved count weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resolvedCount, unresolvedCount, suppliedWeight } = request;
  const compute = (): Output => {
    H.integer(resolvedCount, 0);
    H.integer(unresolvedCount, 0);
    H.probability(suppliedWeight);
    return {
      weightedCount: resolvedCount + unresolvedCount * suppliedWeight,
      unresolvedContribution: unresolvedCount * suppliedWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resolvedCount: 10, unresolvedCount: 4, suppliedWeight: 0.5 },
  output: { weightedCount: 12, unresolvedContribution: 2 },
} satisfies ToolExample<Input, Output>;
export const taxonUnresolvedCountWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/taxon-unresolved-count-weight",
    title: "Taxon Unresolved Count Weight Tool",
    description:
      "Calculate taxon unresolved count weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resolvedCount: { type: "integer", minimum: 0 },
        unresolvedCount: { type: "integer", minimum: 0 },
        suppliedWeight: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["resolvedCount", "unresolvedCount", "suppliedWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedCount: { type: "number" },
        unresolvedContribution: { type: "number" },
      },
      required: ["weightedCount", "unresolvedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "resolvedCount",
          label: "Resolved Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unresolvedCount",
          label: "Unresolved Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedCount",
          label: "Weighted Count",
          valueType: { type: "number" },
        },
        {
          id: "unresolvedContribution",
          label: "Unresolved Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonUnresolvedCountWeightTool.execute;
export default taxonUnresolvedCountWeightTool;
