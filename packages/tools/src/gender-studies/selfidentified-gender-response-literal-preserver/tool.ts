import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly response: string };
export type Output = {
  readonly preservedResponse: string;
  readonly codePointCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { response: { type: "string", maxLength: 8192 } },
  required: ["response"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedResponse: { type: "string", maxLength: 8192 },
    codePointCount: { type: "integer" },
  },
  required: ["preservedResponse", "codePointCount"],
} as const;
/** Preserve a voluntary self-described gender response literally, including spacing and capitalization, and report Unicode code-point count without assigning a category. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response } = request;
  const compute = (): Output => {
    return {
      preservedResponse: response,
      codePointCount: [...response].length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: "Two-Spirit" },
  output: { preservedResponse: "Two-Spirit", codePointCount: 10 },
} satisfies ToolExample<Input, Output>;
export const selfidentifiedGenderResponseLiteralPreserverTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gender-studies/selfidentified-gender-response-literal-preserver",
      title: "Selfidentified Gender Response Literal Preserver Tool",
      description:
        "Preserve a voluntary self-described gender response literally, including spacing and capitalization, and report Unicode code-point count without assigning a category.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { response: { type: "string", maxLength: 8192 } },
        required: ["response"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preservedResponse: { type: "string", maxLength: 8192 },
          codePointCount: { type: "integer" },
        },
        required: ["preservedResponse", "codePointCount"],
      },
      ports: {
        inputs: [
          {
            id: "response",
            label: "Response",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "preservedResponse",
            label: "Preserved Response",
            valueType: { type: "string" },
          },
          {
            id: "codePointCount",
            label: "Code Point Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = selfidentifiedGenderResponseLiteralPreserverTool.execute;
export default selfidentifiedGenderResponseLiteralPreserverTool;
