import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = { readonly external: boolean; readonly file: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    external: { type: "boolean" },
    file: { type: "string", maxLength: 8192 },
  },
  required: ["external", "file"],
} as const;
/** Compute package json license spdx prefix from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const m = /^SEE LICENSE IN (.+)(?![\s\S])/.exec(value);
    domain(value.length > 0);
    return { external: !!m, file: m?.[1] ?? "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "SEE LICENSE IN LICENSE.txt" },
  output: { external: true, file: "LICENSE.txt" },
} satisfies ToolExample<Input, Output>;
export const packageJsonLicenseSpdxPrefixTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/package-json-license-spdx-prefix",
  title: "Package JSON License SPDX Prefix Tool",
  description:
    "Compute package json license spdx prefix from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "external", label: "External", valueType: { type: "boolean" } },
      { id: "file", label: "File", valueType: { type: "string" } },
    ],
  },
});
export const run = packageJsonLicenseSpdxPrefixTool.execute;
export default packageJsonLicenseSpdxPrefixTool;
