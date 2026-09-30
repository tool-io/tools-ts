import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = { readonly canonical: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { canonical: { type: "string", maxLength: 8192 } },
  required: ["canonical"],
} as const;
/** Compute json number exponent sign normalizer from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    domain(
      /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\s\S])/.test(lexeme),
    );
    return {
      canonical: lexeme.replace(
        /[eE]([+-]?)(\d+)/,
        (_, sign: string, digits: string) =>
          "e" + (sign === "-" ? "-" : "") + digits.replace(/^0+(?=\d)/, ""),
      ),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: "1E+003" },
  output: { canonical: "1e3" },
} satisfies ToolExample<Input, Output>;
export const jsonNumberExponentSignNormalizerTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-number-exponent-sign-normalizer",
  title: "JSON Number Exponent Sign Normalizer Tool",
  description:
    "Compute json number exponent sign normalizer from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lexeme",
        label: "Lexeme",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "canonical", label: "Canonical", valueType: { type: "string" } },
    ],
  },
});
export const run = jsonNumberExponentSignNormalizerTool.execute;
export default jsonNumberExponentSignNormalizerTool;
