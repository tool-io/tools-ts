import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly suppliedPreparationSuffix: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPreparationSuffix: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
  },
  required: ["specimenId", "suppliedPreparationSuffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an exact zoological specimen identifier and supplied preparation qualifier without inferring specimen state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, suppliedPreparationSuffix } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(suppliedPreparationSuffix.length > 0, "suppliedPreparationSuffix");
    return { token: JSON.stringify([specimenId, suppliedPreparationSuffix]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", suppliedPreparationSuffix: "skin" },
  output: { token: '["S17","skin"]' },
} satisfies ToolExample<Input, Output>;
export const zoologicalSpecimenPreparationSuffixTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "zoology/zoological-specimen-preparation-suffix",
      title: "Zoological Specimen Preparation Suffix Tool",
      description:
        "Preserve an exact zoological specimen identifier and supplied preparation qualifier without inferring specimen state.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specimenId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPreparationSuffix: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["specimenId", "suppliedPreparationSuffix"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "specimenId",
            label: "Specimen Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPreparationSuffix",
            label: "Supplied Preparation Suffix",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = zoologicalSpecimenPreparationSuffixTool.execute;
export default zoologicalSpecimenPreparationSuffixTool;
