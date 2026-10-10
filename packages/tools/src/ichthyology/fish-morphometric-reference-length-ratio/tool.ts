import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly traitLength: number;
  readonly referenceLength: number;
};
export type Output = { readonly relativeLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    traitLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["traitLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeLength: { type: "number" } },
  required: ["relativeLength"],
} as const;
/** Normalize an explicit fish morphometric length to a supplied compatible positive reference length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { traitLength, referenceLength } = request;
  const compute = (): Output => {
    H.domain(traitLength >= 0, "traitLength");
    (H.domain(referenceLength > 0, "referenceLength"), referenceLength);
    return { relativeLength: traitLength / referenceLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { traitLength: 6, referenceLength: 24 },
  output: { relativeLength: 0.25 },
} satisfies ToolExample<Input, Output>;
export const fishMorphometricReferenceLengthRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["ichthyology", "biology"],
        keywords: ["ichthyology", "biology"],
      },
      id: "ichthyology/fish-morphometric-reference-length-ratio",
      title: "Fish Morphometric Reference Length Ratio",
      description:
        "Normalize an explicit fish morphometric length to a supplied compatible positive reference length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          traitLength: { type: "number", minimum: 0 },
          referenceLength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["traitLength", "referenceLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeLength: { type: "number" } },
        required: ["relativeLength"],
      },
      ports: {
        inputs: [
          {
            id: "traitLength",
            label: "Trait Length",
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
            id: "relativeLength",
            label: "Relative Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fishMorphometricReferenceLengthRatioTool.execute;
export default fishMorphometricReferenceLengthRatioTool;
