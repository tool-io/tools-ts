import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorityId: string;
  readonly formalName: string;
  readonly suppliedPseudonym: string;
  readonly displayPseudonym: boolean;
};
export type Output = {
  readonly displayName: string;
  readonly authorityKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorityId: { type: "string", maxLength: 8192, minLength: 1 },
    formalName: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
    displayPseudonym: { type: "boolean" },
  },
  required: [
    "authorityId",
    "formalName",
    "suppliedPseudonym",
    "displayPseudonym",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayName: { type: "string", maxLength: 8192 },
    authorityKey: { type: "string", maxLength: 8192 },
  },
  required: ["displayName", "authorityKey"],
} as const;
/** Choose an explicit artist name or supplied pseudonym for display without resolving identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorityId, formalName, suppliedPseudonym, displayPseudonym } =
    request;
  const compute = (): Output => {
    H.domain(
      authorityId.length > 0 &&
        formalName.length > 0 &&
        suppliedPseudonym.length > 0,
      "authorityId",
    );
    return {
      displayName: displayPseudonym ? suppliedPseudonym : formalName,
      authorityKey: authorityId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    authorityId: "AUTH17",
    formalName: "Name A",
    suppliedPseudonym: "Alias B",
    displayPseudonym: true,
  },
  output: { displayName: "Alias B", authorityKey: "AUTH17" },
} satisfies ToolExample<Input, Output>;
export const artistAuthorityPseudonymDisplayChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-history", "art history", "arts and design"],
        keywords: ["art history", "arts and design"],
      },
      id: "art-history/artist-authority-pseudonym-display-choice",
      title: "Artist Authority Pseudonym Display Choice",
      description:
        "Choose an explicit artist name or supplied pseudonym for display without resolving identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          authorityId: { type: "string", maxLength: 8192, minLength: 1 },
          formalName: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
          displayPseudonym: { type: "boolean" },
        },
        required: [
          "authorityId",
          "formalName",
          "suppliedPseudonym",
          "displayPseudonym",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          displayName: { type: "string", maxLength: 8192 },
          authorityKey: { type: "string", maxLength: 8192 },
        },
        required: ["displayName", "authorityKey"],
      },
      ports: {
        inputs: [
          {
            id: "authorityId",
            label: "Authority Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "formalName",
            label: "Formal Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPseudonym",
            label: "Supplied Pseudonym",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "displayPseudonym",
            label: "Display Pseudonym",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "displayName",
            label: "Display Name",
            valueType: { type: "string" },
          },
          {
            id: "authorityKey",
            label: "Authority Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = artistAuthorityPseudonymDisplayChoiceTool.execute;
export default artistAuthorityPseudonymDisplayChoiceTool;
