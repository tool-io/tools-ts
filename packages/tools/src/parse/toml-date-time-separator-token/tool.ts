import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly separator: string };
export type Output = { readonly valid: boolean; readonly canonical: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { separator: { type: "string", maxLength: 8192 } },
  required: ["separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    canonical: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "canonical"],
} as const;
/** Calculate toml date time separator token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { separator } = request;
  const compute = (): Output => {
    const valid = ["T", "t", " "].includes(separator);
    return { valid, canonical: valid ? "T" : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { separator: " " },
  output: { valid: true, canonical: "T" },
} satisfies ToolExample<Input, Output>;
export const tomlDateTimeSeparatorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/toml-date-time-separator-token",
    title: "Toml Date Time Separator Token Tool",
    description:
      "Calculate toml date time separator token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { separator: { type: "string", maxLength: 8192 } },
      required: ["separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        canonical: { type: "string", maxLength: 8192 },
      },
      required: ["valid", "canonical"],
    },
    ports: {
      inputs: [
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "canonical", label: "Canonical", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = tomlDateTimeSeparatorTokenTool.execute;
export default tomlDateTimeSeparatorTokenTool;
