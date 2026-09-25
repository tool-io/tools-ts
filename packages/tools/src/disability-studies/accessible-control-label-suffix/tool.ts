import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly suffix: string;
  readonly required: boolean;
  readonly separator: string;
};
export type Output = { readonly text: string; readonly suffixPresent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
    required: { type: "boolean" },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["label", "suffix", "required", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    suffixPresent: { type: "boolean" },
  },
  required: ["text", "suffixPresent"],
} as const;
/** Append a supplied semantic suffix without inferring an accessibility role or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, suffix, required, separator } = request;
  const compute = (): Output => {
    const text = required ? label + separator + suffix : label;
    return { text, suffixPresent: required && suffix.length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    label: "Save",
    suffix: "required",
    required: true,
    separator: " — ",
  },
  output: { text: "Save — required", suffixPresent: true },
} satisfies ToolExample<Input, Output>;
export const accessibleControlLabelSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/accessible-control-label-suffix",
    title: "Accessible Control Label Suffix Tool",
    description:
      "Append a supplied semantic suffix without inferring an accessibility role or compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        suffix: { type: "string", maxLength: 8192 },
        required: { type: "boolean" },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["label", "suffix", "required", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        suffixPresent: { type: "boolean" },
      },
      required: ["text", "suffixPresent"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suffix",
          label: "Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "text", label: "Text", valueType: { type: "string" } },
        {
          id: "suffixPresent",
          label: "Suffix Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = accessibleControlLabelSuffixTool.execute;
export default accessibleControlLabelSuffixTool;
