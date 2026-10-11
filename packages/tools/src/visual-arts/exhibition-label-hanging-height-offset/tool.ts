import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedReferenceHeight: number;
  readonly recordedLabelHeight: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedReferenceHeight: { type: "number" },
    recordedLabelHeight: { type: "number" },
  },
  required: ["suppliedReferenceHeight", "recordedLabelHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference height from a recorded exhibition label height on compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedReferenceHeight, recordedLabelHeight } = request;
  const compute = (): Output => {
    return { signedGap: recordedLabelHeight - suppliedReferenceHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedReferenceHeight: 12, recordedLabelHeight: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const exhibitionLabelHangingHeightOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/exhibition-label-hanging-height-offset",
    title: "Exhibition Label Hanging Height Offset",
    description:
      "Subtract an explicit reference height from a recorded exhibition label height on compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedReferenceHeight: { type: "number" },
        recordedLabelHeight: { type: "number" },
      },
      required: ["suppliedReferenceHeight", "recordedLabelHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedReferenceHeight",
          label: "Supplied Reference Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedLabelHeight",
          label: "Recorded Label Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exhibitionLabelHangingHeightOffsetTool.execute;
export default exhibitionLabelHangingHeightOffsetTool;
