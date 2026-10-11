import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly length: number;
  readonly width: number;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    length: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "length", "width", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit wound length and width without inferring area, severity, or management. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, length, width, unitText } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && unitText.length > 0, "recordId");
    H.domain(length >= 0 && width >= 0, "length");
    return {
      label:
        recordId + "; length=" + length + "; width=" + width + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "U17", length: 12, width: 8, unitText: "mm" },
  output: { label: "U17; length=12; width=8 mm" },
} satisfies ToolExample<Input, Output>;
export const ulcerRecordLengthWidthUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["podiatry", "health and medicine"],
      keywords: ["podiatry", "health and medicine"],
    },
    id: "podiatry/ulcer-record-length-width-unit",
    title: "Ulcer Record Length Width Unit",
    description:
      "Label explicit wound length and width without inferring area, severity, or management.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        length: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "length", "width", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ulcerRecordLengthWidthUnitTool.execute;
export default ulcerRecordLengthWidthUnitTool;
