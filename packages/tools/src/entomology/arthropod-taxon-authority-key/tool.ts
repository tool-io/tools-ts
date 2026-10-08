import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxonCode: string;
  readonly authority: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxonCode: { type: "string", maxLength: 8192, minLength: 1 },
    authority: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taxonCode", "authority", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied arthropod taxon code by its authority and version without resolving taxonomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxonCode, authority, version } = request;
  const compute = (): Output => {
    H.domain(taxonCode.length > 0, "taxonCode");
    H.domain(authority.length > 0, "authority");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([taxonCode, authority, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taxonCode: "T17", authority: "Catalogue A", version: "2026" },
  output: { token: '["T17","Catalogue A","2026"]' },
} satisfies ToolExample<Input, Output>;
export const arthropodTaxonAuthorityKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["entomology", "biology"],
      keywords: ["entomology", "biology"],
    },
    id: "entomology/arthropod-taxon-authority-key",
    title: "Arthropod Taxon Authority Key",
    description:
      "Qualify a supplied arthropod taxon code by its authority and version without resolving taxonomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxonCode: { type: "string", maxLength: 8192, minLength: 1 },
        authority: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taxonCode", "authority", "version"],
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
          id: "taxonCode",
          label: "Taxon Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authority",
          label: "Authority",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = arthropodTaxonAuthorityKeyTool.execute;
export default arthropodTaxonAuthorityKeyTool;
