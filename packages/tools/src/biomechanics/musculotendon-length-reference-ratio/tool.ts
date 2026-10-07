import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLength: number;
  readonly referenceLength: number;
};
export type Output = { readonly lengthRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthRatio: { type: "number" } },
  required: ["lengthRatio"],
} as const;
/** Divide supplied musculotendon length by an explicit positive reference length without deriving force. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLength, referenceLength } = request;
  const compute = (): Output => {
    H.domain(measuredLength >= 0, "measuredLength");
    (H.domain(
      Number.isFinite(referenceLength) && referenceLength > 0,
      "referenceLength",
    ),
      referenceLength);
    return { lengthRatio: measuredLength / referenceLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredLength: 12, referenceLength: 10 },
  output: { lengthRatio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const musculotendonLengthReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/musculotendon-length-reference-ratio",
    title: "Musculotendon Length Reference Ratio",
    description:
      "Divide supplied musculotendon length by an explicit positive reference length without deriving force.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredLength", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lengthRatio: { type: "number" } },
      required: ["lengthRatio"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLength",
          label: "Measured Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthRatio",
          label: "Length Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = musculotendonLengthReferenceRatioTool.execute;
export default musculotendonLengthReferenceRatioTool;
