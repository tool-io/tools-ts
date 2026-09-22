import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstConceptIds: readonly string[];
  readonly secondConceptIds: readonly string[];
  readonly sourceCompatible: boolean;
};
export type Output = {
  readonly sharedIds: readonly string[];
  readonly overlapKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstConceptIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondConceptIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceCompatible: { type: "boolean" },
  },
  required: ["firstConceptIds", "secondConceptIds", "sourceCompatible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    overlapKnown: { type: "boolean" },
  },
  required: ["sharedIds", "overlapKnown"],
} as const;
/** Compare supplied concept identifiers only under an explicit source-compatibility flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstConceptIds, secondConceptIds, sourceCompatible } = request;
  const compute = (): Output => {
    return {
      sharedIds: sourceCompatible
        ? [...new Set(firstConceptIds)].filter((x) =>
            secondConceptIds.includes(x),
          )
        : [],
      overlapKnown: sourceCompatible,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstConceptIds: ["T1", "T2"],
    secondConceptIds: ["T2", "T3"],
    sourceCompatible: true,
  },
  output: { sharedIds: ["T2"], overlapKnown: true },
} satisfies ToolExample<Input, Output>;
export const taxonConceptOverlapFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/taxon-concept-overlap-flag",
    title: "Taxon Concept Overlap Flag Tool",
    description:
      "Compare supplied concept identifiers only under an explicit source-compatibility flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstConceptIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondConceptIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceCompatible: { type: "boolean" },
      },
      required: ["firstConceptIds", "secondConceptIds", "sourceCompatible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        overlapKnown: { type: "boolean" },
      },
      required: ["sharedIds", "overlapKnown"],
    },
    ports: {
      inputs: [
        {
          id: "firstConceptIds",
          label: "First Concept Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondConceptIds",
          label: "Second Concept Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceCompatible",
          label: "Source Compatible",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sharedIds",
          label: "Shared Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "overlapKnown",
          label: "Overlap Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonConceptOverlapFlagTool.execute;
export default taxonConceptOverlapFlagTool;
