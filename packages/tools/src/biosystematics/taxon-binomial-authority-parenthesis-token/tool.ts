import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string };
export type Output = {
  readonly genus: string;
  readonly epithet: string;
  readonly authority: string;
  readonly parenthesized: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { name: { type: "string", maxLength: 8192 } },
  required: ["name"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    genus: { type: "string", maxLength: 8192 },
    epithet: { type: "string", maxLength: 8192 },
    authority: { type: "string", maxLength: 8192 },
    parenthesized: { type: "boolean" },
  },
  required: ["genus", "epithet", "authority", "parenthesized"],
} as const;
/** Split an ASCII binomial subset and supplied authority text without deciding nomenclatural validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name } = request;
  const compute = (): Output => {
    const match = /^([A-Z][a-z]+) ([a-z][a-z-]+)(?: (.+))?(?![\s\S])/.exec(
      name,
    );
    H.domain(match && !/[\r\n]/.test(name), "name");
    const tail = match[3] ?? "",
      parenthesized = tail.startsWith("(") && tail.endsWith(")");
    H.domain(
      parenthesized ? !/[()]/.test(tail.slice(1, -1)) : !/[()]/.test(tail),
      "name",
    );
    return {
      genus: match[1],
      epithet: match[2],
      authority: parenthesized ? tail.slice(1, -1) : tail,
      parenthesized,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus bus (Smith, 1900)" },
  output: {
    genus: "Aus",
    epithet: "bus",
    authority: "Smith, 1900",
    parenthesized: true,
  },
} satisfies ToolExample<Input, Output>;
export const taxonBinomialAuthorityParenthesisTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosystematics/taxon-binomial-authority-parenthesis-token",
      title: "Taxon Binomial Authority Parenthesis Token Tool",
      description:
        "Split an ASCII binomial subset and supplied authority text without deciding nomenclatural validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { name: { type: "string", maxLength: 8192 } },
        required: ["name"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          genus: { type: "string", maxLength: 8192 },
          epithet: { type: "string", maxLength: 8192 },
          authority: { type: "string", maxLength: 8192 },
          parenthesized: { type: "boolean" },
        },
        required: ["genus", "epithet", "authority", "parenthesized"],
      },
      ports: {
        inputs: [
          {
            id: "name",
            label: "Name",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "genus", label: "Genus", valueType: { type: "string" } },
          { id: "epithet", label: "Epithet", valueType: { type: "string" } },
          {
            id: "authority",
            label: "Authority",
            valueType: { type: "string" },
          },
          {
            id: "parenthesized",
            label: "Parenthesized",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = taxonBinomialAuthorityParenthesisTokenTool.execute;
export default taxonBinomialAuthorityParenthesisTokenTool;
