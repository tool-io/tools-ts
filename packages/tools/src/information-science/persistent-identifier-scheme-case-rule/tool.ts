import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifierText: string;
  readonly suppliedCaseInsensitive: boolean;
};
export type Output = { readonly comparisonText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifierText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCaseInsensitive: { type: "boolean" },
  },
  required: ["identifierText", "suppliedCaseInsensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { comparisonText: { type: "string", maxLength: 8192 } },
  required: ["comparisonText"],
} as const;
/** Apply an explicitly supplied Unicode-default lowercase comparison policy to identifier text without assuming scheme-specific case rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifierText, suppliedCaseInsensitive } = request;
  const compute = (): Output => {
    H.domain(identifierText.length > 0, "identifierText");
    return {
      comparisonText: suppliedCaseInsensitive
        ? identifierText.toLowerCase()
        : identifierText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifierText: "ABC:Item17", suppliedCaseInsensitive: true },
  output: { comparisonText: "abc:item17" },
} satisfies ToolExample<Input, Output>;
export const persistentIdentifierSchemeCaseRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/persistent-identifier-scheme-case-rule",
    title: "Persistent Identifier Scheme Case Rule Tool",
    description:
      "Apply an explicitly supplied Unicode-default lowercase comparison policy to identifier text without assuming scheme-specific case rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifierText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCaseInsensitive: { type: "boolean" },
      },
      required: ["identifierText", "suppliedCaseInsensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { comparisonText: { type: "string", maxLength: 8192 } },
      required: ["comparisonText"],
    },
    ports: {
      inputs: [
        {
          id: "identifierText",
          label: "Identifier Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCaseInsensitive",
          label: "Supplied Case Insensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "comparisonText",
          label: "Comparison Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = persistentIdentifierSchemeCaseRuleTool.execute;
export default persistentIdentifierSchemeCaseRuleTool;
