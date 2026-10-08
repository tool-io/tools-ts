import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPseudonym: string;
  readonly secondPseudonym: string;
};
export type Output = { readonly consistent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
    secondPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstPseudonym", "secondPseudonym"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { consistent: { type: "boolean" } },
  required: ["consistent"],
} as const;
/** Compare exact supplied court-publication pseudonym tokens without revealing or inferring identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPseudonym, secondPseudonym } = request;
  const compute = (): Output => {
    H.domain(firstPseudonym.length > 0, "firstPseudonym");
    H.domain(secondPseudonym.length > 0, "secondPseudonym");
    return { consistent: firstPseudonym === secondPseudonym };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPseudonym: "Witness A", secondPseudonym: "Witness A" },
  output: { consistent: true },
} satisfies ToolExample<Input, Output>;
export const courtPublicationPseudonymConsistencyPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["criminal-justice", "criminal justice", "social sciences"],
        keywords: ["criminal justice", "social sciences"],
      },
      id: "criminal-justice/court-publication-pseudonym-consistency-pair",
      title: "Court Publication Pseudonym Consistency Pair",
      description:
        "Compare exact supplied court-publication pseudonym tokens without revealing or inferring identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
          secondPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["firstPseudonym", "secondPseudonym"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { consistent: { type: "boolean" } },
        required: ["consistent"],
      },
      ports: {
        inputs: [
          {
            id: "firstPseudonym",
            label: "First Pseudonym",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondPseudonym",
            label: "Second Pseudonym",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "consistent",
            label: "Consistent",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = courtPublicationPseudonymConsistencyPairTool.execute;
export default courtPublicationPseudonymConsistencyPairTool;
