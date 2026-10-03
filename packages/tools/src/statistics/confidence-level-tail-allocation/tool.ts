import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly confidence: number;
  readonly lowerShare: number;
};
export type Output = {
  readonly alpha: number;
  readonly lowerTail: number;
  readonly upperTail: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "number", minimum: 0, maximum: 1 },
    lowerShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["confidence", "lowerShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alpha: { type: "number" },
    lowerTail: { type: "number" },
    upperTail: { type: "number" },
  },
  required: ["alpha", "lowerTail", "upperTail"],
} as const;
/** Calculate confidence level tail allocation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { confidence, lowerShare } = request;
  const compute = (): Output => {
    H.probability(confidence);
    H.probability(lowerShare);
    const alpha = 1 - confidence,
      lowerTail = alpha * lowerShare;
    return { alpha, lowerTail, upperTail: alpha - lowerTail };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { confidence: 0.9, lowerShare: 0.5 },
  output: {
    alpha: 0.09999999999999998,
    lowerTail: 0.04999999999999999,
    upperTail: 0.04999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const confidenceLevelTailAllocationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/confidence-level-tail-allocation",
    title: "Confidence Level Tail Allocation Tool",
    description:
      "Calculate confidence level tail allocation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        confidence: { type: "number", minimum: 0, maximum: 1 },
        lowerShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["confidence", "lowerShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alpha: { type: "number" },
        lowerTail: { type: "number" },
        upperTail: { type: "number" },
      },
      required: ["alpha", "lowerTail", "upperTail"],
    },
    ports: {
      inputs: [
        {
          id: "confidence",
          label: "Confidence",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerShare",
          label: "Lower Share",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "alpha", label: "Alpha", valueType: { type: "number" } },
        { id: "lowerTail", label: "Lower Tail", valueType: { type: "number" } },
        { id: "upperTail", label: "Upper Tail", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = confidenceLevelTailAllocationTool.execute;
export default confidenceLevelTailAllocationTool;
