import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly subfield: string };
export type Output = { readonly code: string; readonly value: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { subfield: { type: "string", maxLength: 8192 } },
  required: ["subfield"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    value: { type: "string", maxLength: 8192 },
  },
  required: ["code", "value"],
} as const;
/** Split one display-form MARC subfield beginning with a literal dollar sign and one lowercase alphanumeric code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subfield } = request;
  const compute = (): Output => {
    H.domain(/^\$[a-z0-9]/.test(subfield), "subfield");
    return { code: subfield[1], value: subfield.slice(2) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subfield: "$aThe title" },
  output: { code: "a", value: "The title" },
} satisfies ToolExample<Input, Output>;
export const marcSubFieldCodeSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/marc-sub-field-code-split",
    title: "Marc Sub Field Code Split Tool",
    description:
      "Split one display-form MARC subfield beginning with a literal dollar sign and one lowercase alphanumeric code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { subfield: { type: "string", maxLength: 8192 } },
      required: ["subfield"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        value: { type: "string", maxLength: 8192 },
      },
      required: ["code", "value"],
    },
    ports: {
      inputs: [
        {
          id: "subfield",
          label: "Subfield",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "code", label: "Code", valueType: { type: "string" } },
        { id: "value", label: "Value", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = marcSubFieldCodeSplitTool.execute;
export default marcSubFieldCodeSplitTool;
