import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resolverPrefix: string;
  readonly identifier: string;
};
export type Output = { readonly url: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resolverPrefix: { type: "string", maxLength: 8192 },
    identifier: { type: "string", maxLength: 8192 },
  },
  required: ["resolverPrefix", "identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { url: { type: "string", maxLength: 8192 } },
  required: ["url"],
} as const;
/** Append one percent-encoded opaque identifier to an explicit HTTP(S) resolver prefix; embedded identifier slashes are encoded, and no resolver service is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resolverPrefix, identifier } = request;
  const compute = (): Output => {
    H.domain(/^https?:\/\/[^\s?#]+\/(?![\s\S])/.test(resolverPrefix));
    H.domain(
      identifier.length > 0 && !/[\u0000-\u001f\u007f]/.test(identifier),
    );
    for (let i = 0; i < identifier.length; i++) {
      const c = identifier.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        const d = identifier.charCodeAt(++i);
        H.domain(
          d >= 0xdc00 && d <= 0xdfff,
          "identifier",
          "Identifier must contain paired Unicode surrogates.",
        );
      } else
        H.domain(
          c < 0xdc00 || c > 0xdfff,
          "identifier",
          "Identifier must contain paired Unicode surrogates.",
        );
    }
    return { url: resolverPrefix + encodeURIComponent(identifier) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resolverPrefix: "https://example.test/id/", identifier: "A/B 2" },
  output: { url: "https://example.test/id/A%2FB%202" },
} satisfies ToolExample<Input, Output>;
export const persistentIdentifierResolverPrefixTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/persistent-identifier-resolver-prefix-token",
      title: "Persistent Identifier Resolver Prefix Token Tool",
      description:
        "Append one percent-encoded opaque identifier to an explicit HTTP(S) resolver prefix; embedded identifier slashes are encoded, and no resolver service is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resolverPrefix: { type: "string", maxLength: 8192 },
          identifier: { type: "string", maxLength: 8192 },
        },
        required: ["resolverPrefix", "identifier"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { url: { type: "string", maxLength: 8192 } },
        required: ["url"],
      },
      ports: {
        inputs: [
          {
            id: "resolverPrefix",
            label: "Resolver Prefix",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "identifier",
            label: "Identifier",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [{ id: "url", label: "Url", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = persistentIdentifierResolverPrefixTokenTool.execute;
export default persistentIdentifierResolverPrefixTokenTool;
