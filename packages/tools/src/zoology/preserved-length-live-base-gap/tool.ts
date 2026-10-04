import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preservedLength: number;
  readonly suppliedLiveLength: number;
  readonly retentionFraction: number;
};
export type Output = {
  readonly predictedPreserved: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preservedLength: { type: "number", minimum: 0 },
    suppliedLiveLength: { type: "number", minimum: 0 },
    retentionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["preservedLength", "suppliedLiveLength", "retentionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedPreserved: { type: "number" },
    gap: { type: "number" },
  },
  required: ["predictedPreserved", "gap"],
} as const;
/** Compare supplied live and preserved lengths using an independently supplied retention factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preservedLength, suppliedLiveLength, retentionFraction } = request;
  const compute = (): Output => {
    H.domain(preservedLength >= 0 && suppliedLiveLength >= 0);
    H.probability(retentionFraction);
    return {
      predictedPreserved: suppliedLiveLength * retentionFraction,
      gap: preservedLength - suppliedLiveLength * retentionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preservedLength: 9, suppliedLiveLength: 10, retentionFraction: 0.8 },
  output: { predictedPreserved: 8, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const preservedLengthLiveBaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/preserved-length-live-base-gap",
    title: "Preserved Length Live Base Gap Tool",
    description:
      "Compare supplied live and preserved lengths using an independently supplied retention factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preservedLength: { type: "number", minimum: 0 },
        suppliedLiveLength: { type: "number", minimum: 0 },
        retentionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["preservedLength", "suppliedLiveLength", "retentionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedPreserved: { type: "number" },
        gap: { type: "number" },
      },
      required: ["predictedPreserved", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "preservedLength",
          label: "Preserved Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLiveLength",
          label: "Supplied Live Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retentionFraction",
          label: "Retention Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedPreserved",
          label: "Predicted Preserved",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = preservedLengthLiveBaseGapTool.execute;
export default preservedLengthLiveBaseGapTool;
