import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measured: number;
  readonly measuredZero: number;
  readonly reference: number;
  readonly referenceZero: number;
};
export type Output = {
  readonly correctedMeasured: number;
  readonly correctedReference: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measured: { type: "number" },
    measuredZero: { type: "number" },
    reference: { type: "number" },
    referenceZero: { type: "number" },
  },
  required: ["measured", "measuredZero", "reference", "referenceZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedMeasured: { type: "number" },
    correctedReference: { type: "number" },
    gap: { type: "number" },
  },
  required: ["correctedMeasured", "correctedReference", "gap"],
} as const;
/** Compare supplied pressure-channel readings after independent explicit zero corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, measuredZero, reference, referenceZero } = request;
  const compute = (): Output => {
    return {
      correctedMeasured: measured - measuredZero,
      correctedReference: reference - referenceZero,
      gap: measured - measuredZero - reference + referenceZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 12, measuredZero: 2, reference: 8, referenceZero: 1 },
  output: { correctedMeasured: 10, correctedReference: 7, gap: 3 },
} satisfies ToolExample<Input, Output>;
export const pressureZeroReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/pressure-zero-reference-gap",
    title: "Pressure Zero Reference Gap Tool",
    description:
      "Compare supplied pressure-channel readings after independent explicit zero corrections.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        measuredZero: { type: "number" },
        reference: { type: "number" },
        referenceZero: { type: "number" },
      },
      required: ["measured", "measuredZero", "reference", "referenceZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedMeasured: { type: "number" },
        correctedReference: { type: "number" },
        gap: { type: "number" },
      },
      required: ["correctedMeasured", "correctedReference", "gap"],
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
          id: "measuredZero",
          label: "Measured Zero",
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
          id: "referenceZero",
          label: "Reference Zero",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedMeasured",
          label: "Corrected Measured",
          valueType: { type: "number" },
        },
        {
          id: "correctedReference",
          label: "Corrected Reference",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pressureZeroReferenceGapTool.execute;
export default pressureZeroReferenceGapTool;
