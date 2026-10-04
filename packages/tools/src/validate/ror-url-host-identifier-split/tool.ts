import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = { readonly identifier: string; readonly urlForm: boolean };
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
    identifier: { type: "string", maxLength: 8192 },
    urlForm: { type: "boolean" },
  },
  required: ["identifier", "urlForm"],
} as const;
/** Compute ror url host identifier split from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const m =
      /^(https:\/\/ror\.org\/)?(0[0-9a-hj-km-np-tv-z]{6}\d{2})(?![\s\S])/.exec(
        value,
      );
    domain(m);
    return { identifier: m[2], urlForm: !!m[1] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "https://ror.org/03yrm5c26" },
  output: { identifier: "03yrm5c26", urlForm: true },
} satisfies ToolExample<Input, Output>;
export const rorUrlHostIdentifierSplitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/ror-url-host-identifier-split",
  title: "Ror URL Host Identifier Split Tool",
  description:
    "Compute ror url host identifier split from explicit bounded inputs.",
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
      { id: "identifier", label: "Identifier", valueType: { type: "string" } },
      { id: "urlForm", label: "Url Form", valueType: { type: "boolean" } },
    ],
  },
});
export const run = rorUrlHostIdentifierSplitTool.execute;
export default rorUrlHostIdentifierSplitTool;
