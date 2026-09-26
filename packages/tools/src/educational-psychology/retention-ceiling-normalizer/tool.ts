import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly before: number;
  readonly after: number;
  readonly suppliedCeiling: number;
};
export type Output = {
  readonly remainingHeadroom: number;
  readonly normalizedChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number" },
    after: { type: "number" },
    suppliedCeiling: { type: "number" },
  },
  required: ["before", "after", "suppliedCeiling"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingHeadroom: { type: "number" },
    normalizedChange: { type: "number" },
  },
  required: ["remainingHeadroom", "normalizedChange"],
} as const;
/** Calculate retention ceiling normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, after, suppliedCeiling } = request;
  const compute = (): Output => {
    H.domain(suppliedCeiling > before && after <= suppliedCeiling);
    return {
      remainingHeadroom: suppliedCeiling - before,
      normalizedChange: (after - before) / (suppliedCeiling - before),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { before: 40, after: 70, suppliedCeiling: 100 },
  output: { remainingHeadroom: 60, normalizedChange: 0.5 },
} satisfies ToolExample<Input, Output>;
export const retentionCeilingNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/retention-ceiling-normalizer",
    title: "Retention Ceiling Normalizer Tool",
    description:
      "Calculate retention ceiling normalizer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "number" },
        after: { type: "number" },
        suppliedCeiling: { type: "number" },
      },
      required: ["before", "after", "suppliedCeiling"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingHeadroom: { type: "number" },
        normalizedChange: { type: "number" },
      },
      required: ["remainingHeadroom", "normalizedChange"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCeiling",
          label: "Supplied Ceiling",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingHeadroom",
          label: "Remaining Headroom",
          valueType: { type: "number" },
        },
        {
          id: "normalizedChange",
          label: "Normalized Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retentionCeilingNormalizerTool.execute;
export default retentionCeilingNormalizerTool;
