import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly segment: string; readonly fieldNumber: number };
export type Output = {
  readonly splitIndex: number;
  readonly separatorField: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segment: { type: "string", maxLength: 8192 },
    fieldNumber: { type: "integer", minimum: 1 },
  },
  required: ["segment", "fieldNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    splitIndex: { type: "integer" },
    separatorField: { type: "boolean" },
  },
  required: ["splitIndex", "separatorField"],
} as const;
/** Map HL7 field numbering to a segment.split(separator) token index; MSH-1 is the separator itself and uses index sentinel -1. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segment, fieldNumber } = request;
  const compute = (): Output => {
    H.domain(/^[A-Z0-9]{3}(?![\s\S])/.test(segment), "segment");
    H.integer(fieldNumber, 1);
    return {
      splitIndex:
        segment === "MSH"
          ? fieldNumber === 1
            ? -1
            : fieldNumber - 1
          : fieldNumber,
      separatorField: segment === "MSH" && fieldNumber === 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segment: "MSH", fieldNumber: 2 },
  output: { splitIndex: 1, separatorField: false },
} satisfies ToolExample<Input, Output>;
export const hl7SegmentFieldNumberOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/hl7-segment-field-number-offset",
    title: "HL7 Segment Field Number Offset Tool",
    description:
      "Map HL7 field numbering to a segment.split(separator) token index; MSH-1 is the separator itself and uses index sentinel -1.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segment: { type: "string", maxLength: 8192 },
        fieldNumber: { type: "integer", minimum: 1 },
      },
      required: ["segment", "fieldNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        splitIndex: { type: "integer" },
        separatorField: { type: "boolean" },
      },
      required: ["splitIndex", "separatorField"],
    },
    ports: {
      inputs: [
        {
          id: "segment",
          label: "Segment",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fieldNumber",
          label: "Field Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "splitIndex",
          label: "Split Index",
          valueType: { type: "integer" },
        },
        {
          id: "separatorField",
          label: "Separator Field",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hl7SegmentFieldNumberOffsetTool.execute;
export default hl7SegmentFieldNumberOffsetTool;
