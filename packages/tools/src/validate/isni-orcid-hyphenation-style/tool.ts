import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: string; readonly style: string };
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    style: {
      type: "string",
      maxLength: 8192,
      enum: ["spaces", "hyphens", "compact"],
    },
  },
  required: ["identifier", "style"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Compute isni orcid hyphenation style from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier, style } = input;
  const compute = (): Output => {
    domain(/^\d{15}[\dX](?![\s\S])/.test(identifier));
    domain(["spaces", "hyphens", "compact"].includes(style));
    const sep = style === "spaces" ? " " : style === "hyphens" ? "-" : "";
    return { formatted: identifier.match(/.{4}/g)!.join(sep) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "0000000218250097", style: "hyphens" },
  output: { formatted: "0000-0002-1825-0097" },
} satisfies ToolExample<Input, Output>;
export const isniOrcidHyphenationStyleTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/isni-orcid-hyphenation-style",
  title: "ISNI ORCID Hyphenation Style Tool",
  description:
    "Compute isni orcid hyphenation style from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "identifier",
        label: "Identifier",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "style",
        label: "Style",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "formatted", label: "Formatted", valueType: { type: "string" } },
    ],
  },
});
export const run = isniOrcidHyphenationStyleTool.execute;
export default isniOrcidHyphenationStyleTool;
