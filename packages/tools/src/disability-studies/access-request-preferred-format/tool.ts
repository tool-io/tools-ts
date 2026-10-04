import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestCode: string;
  readonly preferredFormat: string;
  readonly availableFormats: readonly string[];
};
export type Output = { readonly available: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestCode: { type: "string", maxLength: 8192 },
    preferredFormat: { type: "string", maxLength: 8192 },
    availableFormats: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestCode", "preferredFormat", "availableFormats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["available", "label"],
} as const;
/** Compare an explicit access-format preference with a supplied availability list without treating an unlisted preference as unreasonable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestCode, preferredFormat, availableFormats } = request;
  const compute = (): Output => {
    H.domain(
      requestCode.length > 0 && preferredFormat.length > 0,
      "requestCode",
    );
    const available = availableFormats.includes(preferredFormat);
    return {
      available,
      label:
        requestCode +
        "; preferred format=" +
        preferredFormat +
        "; " +
        (available ? "available" : "not listed"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestCode: "R17",
    preferredFormat: "large-print",
    availableFormats: ["audio", "large-print"],
  },
  output: {
    available: true,
    label: "R17; preferred format=large-print; available",
  },
} satisfies ToolExample<Input, Output>;
export const accessRequestPreferredFormatTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/access-request-preferred-format",
    title: "Access Request Preferred Format Tool",
    description:
      "Compare an explicit access-format preference with a supplied availability list without treating an unlisted preference as unreasonable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestCode: { type: "string", maxLength: 8192 },
        preferredFormat: { type: "string", maxLength: 8192 },
        availableFormats: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestCode", "preferredFormat", "availableFormats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["available", "label"],
    },
    ports: {
      inputs: [
        {
          id: "requestCode",
          label: "Request Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preferredFormat",
          label: "Preferred Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "availableFormats",
          label: "Available Formats",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = accessRequestPreferredFormatTool.execute;
export default accessRequestPreferredFormatTool;
