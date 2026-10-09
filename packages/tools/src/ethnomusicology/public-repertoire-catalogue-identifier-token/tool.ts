import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catalogueNamespace: string;
  readonly repertoireIdentifier: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catalogueNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    repertoireIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["catalogueNamespace", "repertoireIdentifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact supplied public repertoire identifier with its catalogue namespace without resolving repertoire metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catalogueNamespace, repertoireIdentifier } = request;
  const compute = (): Output => {
    H.domain(catalogueNamespace.length > 0, "catalogueNamespace");
    H.domain(repertoireIdentifier.length > 0, "repertoireIdentifier");
    return {
      token: JSON.stringify([catalogueNamespace, repertoireIdentifier]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { catalogueNamespace: "CAT17", repertoireIdentifier: "00124" },
  output: { token: '["CAT17","00124"]' },
} satisfies ToolExample<Input, Output>;
export const publicRepertoireCatalogueIdentifierTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/public-repertoire-catalogue-identifier-token",
      title: "Public Repertoire Catalogue Identifier Token Tool",
      description:
        "Encode an exact supplied public repertoire identifier with its catalogue namespace without resolving repertoire metadata.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          catalogueNamespace: { type: "string", maxLength: 8192, minLength: 1 },
          repertoireIdentifier: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["catalogueNamespace", "repertoireIdentifier"],
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
            id: "catalogueNamespace",
            label: "Catalogue Namespace",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "repertoireIdentifier",
            label: "Repertoire Identifier",
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
export const run = publicRepertoireCatalogueIdentifierTokenTool.execute;
export default publicRepertoireCatalogueIdentifierTokenTool;
