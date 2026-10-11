import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstResult: number;
  readonly secondResult: number;
};
export type Output = { readonly relativePercentDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstResult: { type: "number" },
    secondResult: { type: "number" },
  },
  required: ["firstResult", "secondResult"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativePercentDifference: { type: "number" } },
  required: ["relativePercentDifference"],
} as const;
/** Compute absolute replicate difference divided by the mean absolute magnitude, expressed as percent; both-zero input is undefined. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstResult, secondResult } = request;
  const compute = (): Output => {
    H.domain(Math.abs(firstResult) + Math.abs(secondResult) > 0, "firstResult");
    return {
      relativePercentDifference:
        (200 * Math.abs(firstResult - secondResult)) /
        (Math.abs(firstResult) + Math.abs(secondResult)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstResult: 8, secondResult: 12 },
  output: { relativePercentDifference: 40 },
} satisfies ToolExample<Input, Output>;
export const qcReplicateRelativeDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-replicate-relative-difference",
    title: "QC Replicate Relative Difference",
    description:
      "Compute absolute replicate difference divided by the mean absolute magnitude, expressed as percent; both-zero input is undefined.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstResult: { type: "number" },
        secondResult: { type: "number" },
      },
      required: ["firstResult", "secondResult"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativePercentDifference: { type: "number" } },
      required: ["relativePercentDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstResult",
          label: "First Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondResult",
          label: "Second Result",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativePercentDifference",
          label: "Relative Percent Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcReplicateRelativeDifferenceTool.execute;
export default qcReplicateRelativeDifferenceTool;
