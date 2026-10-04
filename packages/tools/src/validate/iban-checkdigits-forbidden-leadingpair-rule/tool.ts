import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string };
export type Output = { readonly valid: boolean; readonly forbidden: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, forbidden: { type: "boolean" } },
  required: ["valid", "forbidden"],
} as const;
/** Check the ISO 7064 MOD 97-10 check-pair range 02..98 without validating a complete IBAN. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits } = request;
  const compute = (): Output => {
    const shape = /^\d{2}(?![\s\S])/.test(digits),
      forbidden = shape && ["00", "01", "99"].includes(digits);
    return { valid: shape && !forbidden, forbidden };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "00" },
  output: { valid: false, forbidden: true },
} satisfies ToolExample<Input, Output>;
export const ibanCheckdigitsForbiddenLeadingpairRuleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "validate/iban-checkdigits-forbidden-leadingpair-rule",
      title: "Iban Checkdigits Forbidden Leadingpair Rule Tool",
      description:
        "Check the ISO 7064 MOD 97-10 check-pair range 02..98 without validating a complete IBAN.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { digits: { type: "string", maxLength: 8192 } },
        required: ["digits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valid: { type: "boolean" },
          forbidden: { type: "boolean" },
        },
        required: ["valid", "forbidden"],
      },
      ports: {
        inputs: [
          {
            id: "digits",
            label: "Digits",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
          {
            id: "forbidden",
            label: "Forbidden",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ibanCheckdigitsForbiddenLeadingpairRuleTool.execute;
export default ibanCheckdigitsForbiddenLeadingpairRuleTool;
