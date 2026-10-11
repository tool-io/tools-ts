import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetCellValue: number;
  readonly recordedCellValue: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCellValue: { type: "number" },
    recordedCellValue: { type: "number" },
  },
  required: ["targetCellValue", "recordedCellValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit target map-cell value from its recorded value on a shared unit basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetCellValue, recordedCellValue } = request;
  const compute = (): Output => {
    return { signedGap: recordedCellValue - targetCellValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetCellValue: 12, recordedCellValue: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const precisionMapCellTargetDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/precision-map-cell-target-delta",
    title: "Precision Map Cell Target Delta",
    description:
      "Subtract an explicit target map-cell value from its recorded value on a shared unit basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetCellValue: { type: "number" },
        recordedCellValue: { type: "number" },
      },
      required: ["targetCellValue", "recordedCellValue"],
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
          id: "targetCellValue",
          label: "Target Cell Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedCellValue",
          label: "Recorded Cell Value",
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
export const run = precisionMapCellTargetDeltaTool.execute;
export default precisionMapCellTargetDeltaTool;
