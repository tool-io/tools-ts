import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedLength: number;
  readonly referenceLength: number;
  readonly suppliedCorrection: number;
};
export type Output = {
  readonly correctedLength: number;
  readonly offset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
    suppliedCorrection: { type: "number" },
  },
  required: ["observedLength", "referenceLength", "suppliedCorrection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedLength: { type: "number" },
    offset: { type: "number" },
  },
  required: ["correctedLength", "offset"],
} as const;
/** Apply an independently supplied length correction without species norms or age inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedLength, referenceLength, suppliedCorrection } = request;
  const compute = (): Output => {
    H.domain(
      observedLength >= 0 &&
        referenceLength >= 0 &&
        observedLength + suppliedCorrection >= 0,
    );
    return {
      correctedLength: observedLength + suppliedCorrection,
      offset: observedLength + suppliedCorrection - referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedLength: 10, referenceLength: 12, suppliedCorrection: 1 },
  output: { correctedLength: 11, offset: -1 },
} satisfies ToolExample<Input, Output>;
export const fishLengthReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-length-reference-offset",
    title: "Fish Length Reference Offset Tool",
    description:
      "Apply an independently supplied length correction without species norms or age inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
        suppliedCorrection: { type: "number" },
      },
      required: ["observedLength", "referenceLength", "suppliedCorrection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedLength: { type: "number" },
        offset: { type: "number" },
      },
      required: ["correctedLength", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "observedLength",
          label: "Observed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCorrection",
          label: "Supplied Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedLength",
          label: "Corrected Length",
          valueType: { type: "number" },
        },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fishLengthReferenceOffsetTool.execute;
export default fishLengthReferenceOffsetTool;
