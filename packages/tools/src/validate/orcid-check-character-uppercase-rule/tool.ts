import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly identifier: string };
export type Output = { readonly canonical: string; readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonical: { type: "string", maxLength: 8192 },
    changed: { type: "boolean" },
  },
  required: ["canonical", "changed"],
} as const;
/** Compute orcid check character uppercase rule from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { identifier } = input;
  const compute = (): Output => {
    domain(/^\d{15}[\dXx](?![\s\S])/.test(identifier));
    const canonical = identifier.toUpperCase();
    return { canonical, changed: canonical !== identifier };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { identifier: "000000012146438x" },
  output: { canonical: "000000012146438X", changed: true },
} satisfies ToolExample<Input, Output>;
export const orcidCheckCharacterUppercaseRuleTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/orcid-check-character-uppercase-rule",
  title: "ORCID Check Character Uppercase Rule Tool",
  description:
    "Compute orcid check character uppercase rule from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "canonical", label: "Canonical", valueType: { type: "string" } },
      { id: "changed", label: "Changed", valueType: { type: "boolean" } },
    ],
  },
});
export const run = orcidCheckCharacterUppercaseRuleTool.execute;
export default orcidCheckCharacterUppercaseRuleTool;
