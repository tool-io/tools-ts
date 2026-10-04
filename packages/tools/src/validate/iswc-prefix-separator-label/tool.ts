import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly canonical: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { canonical: { type: "string", maxLength: 8192 } },
  required: ["canonical"],
} as const;
/** Compute iswc prefix separator label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(/^T-?\d{3}\.?\d{3}\.?\d{3}-?\d(?![\s\S])/.test(token));
    const d = token.replace(/[^0-9]/g, "");
    return {
      canonical:
        "T-" +
        d.slice(0, 3) +
        "." +
        d.slice(3, 6) +
        "." +
        d.slice(6, 9) +
        "-" +
        d.slice(9),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "T0345246801" },
  output: { canonical: "T-034.524.680-1" },
} satisfies ToolExample<Input, Output>;
export const iswcPrefixSeparatorLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/iswc-prefix-separator-label",
  title: "ISWC Prefix Separator Label Tool",
  description:
    "Compute iswc prefix separator label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "canonical", label: "Canonical", valueType: { type: "string" } },
    ],
  },
});
export const run = iswcPrefixSeparatorLabelTool.execute;
export default iswcPrefixSeparatorLabelTool;
