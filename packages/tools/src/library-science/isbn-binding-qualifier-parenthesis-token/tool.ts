import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly identifier: string;
  readonly qualifier: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    qualifier: { type: "string", maxLength: 8192 },
  },
  required: ["identifier", "qualifier"],
} as const;
/** Split an identifier and nonempty parenthesized binding qualifier without asserting ISBN validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match = /^([^()]+) \(([^()]+)\)(?![\s\S])/.exec(token);
    H.domain(match !== null);
    return { identifier: match[1], qualifier: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "9781234567897 (paperback)" },
  output: { identifier: "9781234567897", qualifier: "paperback" },
} satisfies ToolExample<Input, Output>;
export const isbnBindingQualifierParenthesisTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "library-science/isbn-binding-qualifier-parenthesis-token",
      title: "ISBN Binding Qualifier Parenthesis Token Tool",
      description:
        "Split an identifier and nonempty parenthesized binding qualifier without asserting ISBN validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          identifier: { type: "string", maxLength: 8192 },
          qualifier: { type: "string", maxLength: 8192 },
        },
        required: ["identifier", "qualifier"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "identifier",
            label: "Identifier",
            valueType: { type: "string" },
          },
          {
            id: "qualifier",
            label: "Qualifier",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = isbnBindingQualifierParenthesisTokenTool.execute;
export default isbnBindingQualifierParenthesisTokenTool;
