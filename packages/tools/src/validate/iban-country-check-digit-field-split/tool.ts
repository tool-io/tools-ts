import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly iban: string };
export type Output = {
  readonly country: string;
  readonly checkDigits: string;
  readonly bban: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { iban: { type: "string", maxLength: 8192 } },
  required: ["iban"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    country: { type: "string", maxLength: 8192 },
    checkDigits: { type: "string", maxLength: 8192 },
    bban: { type: "string", maxLength: 8192 },
  },
  required: ["country", "checkDigits", "bban"],
} as const;
/** Compute iban country check digit field split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { iban } = input;
  const compute = (): Output => {
    domain(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}(?![\s\S])/.test(iban));
    return {
      country: iban.slice(0, 2),
      checkDigits: iban.slice(2, 4),
      bban: iban.slice(4),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { iban: "GB82WEST12345698765432" },
  output: { country: "GB", checkDigits: "82", bban: "WEST12345698765432" },
} satisfies ToolExample<Input, Output>;
export const ibanCountryCheckDigitFieldSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/iban-country-check-digit-field-split",
  title: "Iban Country Check Digit Field Split Tool",
  description:
    "Compute iban country check digit field split from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "iban",
        label: "Iban",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "country", label: "Country", valueType: { type: "string" } },
      {
        id: "checkDigits",
        label: "Check Digits",
        valueType: { type: "string" },
      },
      { id: "bban", label: "Bban", valueType: { type: "string" } },
    ],
  },
});
export const run = ibanCountryCheckDigitFieldSplitTool.execute;
export default ibanCountryCheckDigitFieldSplitTool;
