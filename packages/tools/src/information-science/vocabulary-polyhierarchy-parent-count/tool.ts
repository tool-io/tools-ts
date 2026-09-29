import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concept: string;
  readonly childIds: readonly string[];
  readonly parentIds: readonly string[];
};
export type Output = {
  readonly parentCount: number;
  readonly parentIdsForConcept: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concept: { type: "string", maxLength: 8192 },
    childIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    parentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["concept", "childIds", "parentIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentCount: { type: "integer" },
    parentIdsForConcept: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["parentCount", "parentIdsForConcept"],
} as const;
/** Count distinct explicitly listed direct parents without inferring transitive ancestry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concept, childIds, parentIds } = request;
  const compute = (): Output => {
    H.sameLength(childIds, parentIds);
    return {
      parentCount: new Set(parentIds.filter((x, i) => childIds[i] === concept))
        .size,
      parentIdsForConcept: [
        ...new Set(parentIds.filter((x, i) => childIds[i] === concept)),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concept: "a",
    childIds: ["a", "a", "a"],
    parentIds: ["p1", "p2", "p1"],
  },
  output: { parentCount: 2, parentIdsForConcept: ["p1", "p2"] },
} satisfies ToolExample<Input, Output>;
export const vocabularyPolyhierarchyParentCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/vocabulary-polyhierarchy-parent-count",
    title: "Vocabulary Polyhierarchy Parent Count Tool",
    description:
      "Count distinct explicitly listed direct parents without inferring transitive ancestry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concept: { type: "string", maxLength: 8192 },
        childIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        parentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["concept", "childIds", "parentIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentCount: { type: "integer" },
        parentIdsForConcept: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["parentCount", "parentIdsForConcept"],
    },
    ports: {
      inputs: [
        {
          id: "concept",
          label: "Concept",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "childIds",
          label: "Child Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "parentIds",
          label: "Parent Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "parentCount",
          label: "Parent Count",
          valueType: { type: "integer" },
        },
        {
          id: "parentIdsForConcept",
          label: "Parent Ids For Concept",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vocabularyPolyhierarchyParentCountTool.execute;
export default vocabularyPolyhierarchyParentCountTool;
