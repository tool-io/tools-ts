import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly code: string };
export type Output = {
  readonly owner: string;
  readonly category: string;
  readonly serial: string;
  readonly checkDigit: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    owner: { type: "string", maxLength: 8192 },
    category: { type: "string", maxLength: 8192 },
    serial: { type: "string", maxLength: 8192 },
    checkDigit: { type: "string", maxLength: 8192 },
  },
  required: ["owner", "category", "serial", "checkDigit"],
} as const;
/** Compute iso 6346 owner prefix token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { code } = input;
  const compute = (): Output => {
    domain(/^[A-Z]{3}[UJZ]\d{7}(?![\s\S])/.test(code));
    return {
      owner: code.slice(0, 3),
      category: code[3],
      serial: code.slice(4, 10),
      checkDigit: code[10],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { code: "CSQU3054383" },
  output: { owner: "CSQ", category: "U", serial: "305438", checkDigit: "3" },
} satisfies ToolExample<Input, Output>;
export const iso6346OwnerPrefixTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/iso6346-owner-prefix-token",
  title: "ISO 6346 Owner Prefix Token Tool",
  description:
    "Compute iso 6346 owner prefix token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "owner", label: "Owner", valueType: { type: "string" } },
      { id: "category", label: "Category", valueType: { type: "string" } },
      { id: "serial", label: "Serial", valueType: { type: "string" } },
      { id: "checkDigit", label: "Check Digit", valueType: { type: "string" } },
    ],
  },
});
export const run = iso6346OwnerPrefixTokenTool.execute;
export default iso6346OwnerPrefixTokenTool;
