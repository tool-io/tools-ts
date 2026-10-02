import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredGaps: readonly number[];
  readonly suppliedTargetGaps: readonly number[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly weightedMeanResidual: number;
  readonly maximumAbsoluteResidual: number;
  readonly totalWeight: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredGaps: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedTargetGaps: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["measuredGaps", "suppliedTargetGaps", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedMeanResidual: { type: "number" },
    maximumAbsoluteResidual: { type: "number" },
    totalWeight: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "weightedMeanResidual",
    "maximumAbsoluteResidual",
    "totalWeight",
    "defined",
  ],
} as const;
/** Compare supplied bench fit measurements and targets; no clinical acceptability criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredGaps, suppliedTargetGaps, weights } = request;
  const compute = (): Output => {
    H.sameLength(measuredGaps, suppliedTargetGaps);
    H.sameLength(measuredGaps, weights);
    H.domain(weights.every((x) => x >= 0));
    return (() => {
      const totalWeight = weights.reduce((a, b) => a + b, 0),
        residuals = measuredGaps.map((x, i) => x - suppliedTargetGaps[i]);
      return {
        weightedMeanResidual:
          totalWeight > 0
            ? residuals.reduce((s, x, i) => s + x * weights[i], 0) / totalWeight
            : 0,
        maximumAbsoluteResidual: Math.max(0, ...residuals.map(Math.abs)),
        totalWeight,
        defined: totalWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredGaps: [2, 4], suppliedTargetGaps: [1, 2], weights: [1, 3] },
  output: {
    weightedMeanResidual: 1.75,
    maximumAbsoluteResidual: 2,
    totalWeight: 4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const prosthesisFitReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthesis-fit-reference-gap",
    title: "Prosthesis Fit Reference Gap Tool",
    description:
      "Compare supplied bench fit measurements and targets; no clinical acceptability criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredGaps: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedTargetGaps: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["measuredGaps", "suppliedTargetGaps", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedMeanResidual: { type: "number" },
        maximumAbsoluteResidual: { type: "number" },
        totalWeight: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "weightedMeanResidual",
        "maximumAbsoluteResidual",
        "totalWeight",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "measuredGaps",
          label: "Measured Gaps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedTargetGaps",
          label: "Supplied Target Gaps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "weightedMeanResidual",
          label: "Weighted Mean Residual",
          valueType: { type: "number" },
        },
        {
          id: "maximumAbsoluteResidual",
          label: "Maximum Absolute Residual",
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = prosthesisFitReferenceGapTool.execute;
export default prosthesisFitReferenceGapTool;
