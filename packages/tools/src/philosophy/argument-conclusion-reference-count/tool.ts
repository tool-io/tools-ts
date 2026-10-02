import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conclusionIds: readonly string[];
  readonly references: readonly string[];
};
export type Output = {
  readonly referencedConclusions: number;
  readonly unresolved: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conclusionIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    references: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["conclusionIds", "references"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencedConclusions: { type: "integer" },
    unresolved: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["referencedConclusions", "unresolved"],
} as const;
/** Count exact supplied conclusion references without deciding logical entailment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conclusionIds, references } = request;
  const compute = (): Output => {
    return {
      referencedConclusions: new Set(
        references.filter((x) => conclusionIds.includes(x)),
      ).size,
      unresolved: references.filter((x) => !conclusionIds.includes(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conclusionIds: ["C1", "C2"], references: ["C1", "C1", "C3"] },
  output: { referencedConclusions: 1, unresolved: ["C3"] },
} satisfies ToolExample<Input, Output>;
export const argumentConclusionReferenceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/argument-conclusion-reference-count",
    title: "Argument Conclusion Reference Count Tool",
    description:
      "Count exact supplied conclusion references without deciding logical entailment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conclusionIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        references: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["conclusionIds", "references"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referencedConclusions: { type: "integer" },
        unresolved: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["referencedConclusions", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "conclusionIds",
          label: "Conclusion Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "references",
          label: "References",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "referencedConclusions",
          label: "Referenced Conclusions",
          valueType: { type: "integer" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = argumentConclusionReferenceCountTool.execute;
export default argumentConclusionReferenceCountTool;
