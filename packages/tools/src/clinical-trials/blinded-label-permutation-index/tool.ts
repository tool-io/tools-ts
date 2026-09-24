import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceLabels: readonly string[];
  readonly blindedLabels: readonly string[];
  readonly requestedSource: string;
};
export type Output = {
  readonly permutationIndex: number;
  readonly blindedLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    blindedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedSource: { type: "string", maxLength: 8192 },
  },
  required: ["sourceLabels", "blindedLabels", "requestedSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permutationIndex: { type: "integer" },
    blindedLabel: { type: "string", maxLength: 8192 },
  },
  required: ["permutationIndex", "blindedLabel"],
} as const;
/** Inspect one explicitly supplied synthetic label permutation without generating randomization or accessing trial identities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceLabels, blindedLabels, requestedSource } = request;
  const compute = (): Output => {
    H.sameLength(sourceLabels, blindedLabels);
    H.domain(
      new Set(sourceLabels).size === sourceLabels.length &&
        new Set(blindedLabels).size === blindedLabels.length,
    );
    const permutationIndex = sourceLabels.indexOf(requestedSource);
    H.domain(permutationIndex >= 0);
    return { permutationIndex, blindedLabel: blindedLabels[permutationIndex] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceLabels: ["A", "B", "C"],
    blindedLabels: ["X", "Z", "Y"],
    requestedSource: "B",
  },
  output: { permutationIndex: 1, blindedLabel: "Z" },
} satisfies ToolExample<Input, Output>;
export const blindedLabelPermutationIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/blinded-label-permutation-index",
    title: "Blinded Label Permutation Index Tool",
    description:
      "Inspect one explicitly supplied synthetic label permutation without generating randomization or accessing trial identities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        blindedLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedSource: { type: "string", maxLength: 8192 },
      },
      required: ["sourceLabels", "blindedLabels", "requestedSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permutationIndex: { type: "integer" },
        blindedLabel: { type: "string", maxLength: 8192 },
      },
      required: ["permutationIndex", "blindedLabel"],
    },
    ports: {
      inputs: [
        {
          id: "sourceLabels",
          label: "Source Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "blindedLabels",
          label: "Blinded Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedSource",
          label: "Requested Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "permutationIndex",
          label: "Permutation Index",
          valueType: { type: "integer" },
        },
        {
          id: "blindedLabel",
          label: "Blinded Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = blindedLabelPermutationIndexTool.execute;
export default blindedLabelPermutationIndexTool;
