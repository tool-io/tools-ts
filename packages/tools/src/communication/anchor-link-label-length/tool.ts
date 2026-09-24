import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly countCodePoints: boolean;
};
export type Output = { readonly length: number; readonly utf16Length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    countCodePoints: { type: "boolean" },
  },
  required: ["label", "countCodePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { length: { type: "integer" }, utf16Length: { type: "integer" } },
  required: ["length", "utf16Length"],
} as const;
/** Count supplied link-label code points or UTF-16 code units without measuring visual width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, countCodePoints } = request;
  const compute = (): Output => {
    return {
      length: countCodePoints ? [...label].length : label.length,
      utf16Length: label.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "A🚀", countCodePoints: true },
  output: { length: 2, utf16Length: 3 },
} satisfies ToolExample<Input, Output>;
export const anchorLinkLabelLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/anchor-link-label-length",
    title: "Anchor Link Label Length Tool",
    description:
      "Count supplied link-label code points or UTF-16 code units without measuring visual width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        countCodePoints: { type: "boolean" },
      },
      required: ["label", "countCodePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer" },
        utf16Length: { type: "integer" },
      },
      required: ["length", "utf16Length"],
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
          id: "countCodePoints",
          label: "Count Code Points",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        {
          id: "utf16Length",
          label: "Utf16Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = anchorLinkLabelLengthTool.execute;
export default anchorLinkLabelLengthTool;
