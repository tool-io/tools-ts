import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premiseIds: readonly string[];
  readonly requiredArity: number;
  readonly duplicatesCountSeparately: boolean;
};
export type Output = {
  readonly effectiveArity: number;
  readonly gap: number;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiseIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredArity: { type: "integer", minimum: 0 },
    duplicatesCountSeparately: { type: "boolean" },
  },
  required: ["premiseIds", "requiredArity", "duplicatesCountSeparately"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveArity: { type: "integer" },
    gap: { type: "integer" },
    matches: { type: "boolean" },
  },
  required: ["effectiveArity", "gap", "matches"],
} as const;
/** Compare supplied premise arity under an explicit duplicate policy; no inference validity judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premiseIds, requiredArity, duplicatesCountSeparately } = request;
  const compute = (): Output => {
    H.integer(requiredArity, 0);
    return (() => {
      const effectiveArity = duplicatesCountSeparately
        ? premiseIds.length
        : new Set(premiseIds).size;
      return {
        effectiveArity,
        gap: effectiveArity - requiredArity,
        matches: effectiveArity === requiredArity,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    premiseIds: ["p", "p", "q"],
    requiredArity: 2,
    duplicatesCountSeparately: false,
  },
  output: { effectiveArity: 2, gap: 0, matches: true },
} satisfies ToolExample<Input, Output>;
export const inferencePremiseArityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/inference-premise-arity-gap",
    title: "Inference Premise Arity Gap Tool",
    description:
      "Compare supplied premise arity under an explicit duplicate policy; no inference validity judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiseIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredArity: { type: "integer", minimum: 0 },
        duplicatesCountSeparately: { type: "boolean" },
      },
      required: ["premiseIds", "requiredArity", "duplicatesCountSeparately"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveArity: { type: "integer" },
        gap: { type: "integer" },
        matches: { type: "boolean" },
      },
      required: ["effectiveArity", "gap", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "premiseIds",
          label: "Premise Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredArity",
          label: "Required Arity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicatesCountSeparately",
          label: "Duplicates Count Separately",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveArity",
          label: "Effective Arity",
          valueType: { type: "integer" },
        },
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = inferencePremiseArityGapTool.execute;
export default inferencePremiseArityGapTool;
