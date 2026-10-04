import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly reference: number;
  readonly suppliedZeroOffset: number;
};
export type Output = {
  readonly corrected: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    reference: { type: "number" },
    suppliedZeroOffset: { type: "number" },
  },
  required: ["measured", "reference", "suppliedZeroOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrected: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["corrected", "referenceGap"],
} as const;
/** Compare supplied specimen measurements after explicit zero correction without species norms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, reference, suppliedZeroOffset } = request;
  const compute = (): Output => {
    return {
      corrected: measured - suppliedZeroOffset,
      referenceGap: measured - suppliedZeroOffset - reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 12, reference: 10, suppliedZeroOffset: 1 },
  output: { corrected: 11, referenceGap: 1 },
} satisfies ToolExample<Input, Output>;
export const specimenMeasurementReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/specimen-measurement-reference-offset",
    title: "Specimen Measurement Reference Offset Tool",
    description:
      "Compare supplied specimen measurements after explicit zero correction without species norms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        reference: { type: "number" },
        suppliedZeroOffset: { type: "number" },
      },
      required: ["measured", "reference", "suppliedZeroOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["corrected", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedZeroOffset",
          label: "Supplied Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = specimenMeasurementReferenceOffsetTool.execute;
export default specimenMeasurementReferenceOffsetTool;
