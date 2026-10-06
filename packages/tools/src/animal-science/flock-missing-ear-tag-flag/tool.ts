import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly animalCodes: readonly string[];
  readonly tagCodes: readonly string[];
};
export type Output = { readonly missingTagAnimalCodes: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    animalCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    tagCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["animalCodes", "tagCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingTagAnimalCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingTagAnimalCodes"],
} as const;
/** List explicitly recorded flock animal codes whose corresponding tag field is blank; no animal identity is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { animalCodes, tagCodes } = request;
  const compute = (): Output => {
    H.domain(animalCodes.length === tagCodes.length, "tagCodes");
    H.domain(new Set(animalCodes).size === animalCodes.length, "animalCodes");
    return {
      missingTagAnimalCodes: animalCodes.filter(
        (_, i) => tagCodes[i].trim().length === 0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { animalCodes: ["A1", "A2", "A3"], tagCodes: ["T1", "", "T3"] },
  output: { missingTagAnimalCodes: ["A2"] },
} satisfies ToolExample<Input, Output>;
export const flockMissingEarTagFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/flock-missing-ear-tag-flag",
    title: "Flock Missing Ear Tag Flag",
    description:
      "List explicitly recorded flock animal codes whose corresponding tag field is blank; no animal identity is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        animalCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        tagCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["animalCodes", "tagCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingTagAnimalCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["missingTagAnimalCodes"],
    },
    ports: {
      inputs: [
        {
          id: "animalCodes",
          label: "Animal Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "tagCodes",
          label: "Tag Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingTagAnimalCodes",
          label: "Missing Tag Animal Codes",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = flockMissingEarTagFlagTool.execute;
export default flockMissingEarTagFlagTool;
