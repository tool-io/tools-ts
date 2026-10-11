import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conceptId: string;
  readonly suppliedReferencedConcepts: readonly string[];
};
export type Output = { readonly directSelfReference: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conceptId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReferencedConcepts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["conceptId", "suppliedReferencedConcepts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { directSelfReference: { type: "boolean" } },
  required: ["directSelfReference"],
} as const;
/** Check an explicit referenced-concept list for direct self-reference without detecting indirect cycles or judging a definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conceptId, suppliedReferencedConcepts } = request;
  const compute = (): Output => {
    H.domain(conceptId.length > 0, "conceptId");
    return {
      directSelfReference: suppliedReferencedConcepts.includes(conceptId),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conceptId: "C17", suppliedReferencedConcepts: ["C2", "C17"] },
  output: { directSelfReference: true },
} satisfies ToolExample<Input, Output>;
export const conceptDefinitionCircularSelfReferenceFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["philosophy"],
        keywords: ["philosophy"],
      },
      id: "philosophy/concept-definition-circular-self-reference-flag",
      title: "Concept Definition Circular Self Reference Flag",
      description:
        "Check an explicit referenced-concept list for direct self-reference without detecting indirect cycles or judging a definition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conceptId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedReferencedConcepts: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["conceptId", "suppliedReferencedConcepts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { directSelfReference: { type: "boolean" } },
        required: ["directSelfReference"],
      },
      ports: {
        inputs: [
          {
            id: "conceptId",
            label: "Concept Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedReferencedConcepts",
            label: "Supplied Referenced Concepts",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "directSelfReference",
            label: "Direct Self Reference",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conceptDefinitionCircularSelfReferenceFlagTool.execute;
export default conceptDefinitionCircularSelfReferenceFlagTool;
