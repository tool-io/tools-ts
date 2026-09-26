import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residuals: readonly number[];
  readonly scoreComponents: readonly number[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly weightedMoment: number;
  readonly totalWeight: number;
  readonly meanMoment: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
    scoreComponents: {
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
  required: ["residuals", "scoreComponents", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedMoment: { type: "number" },
    totalWeight: { type: "number" },
    meanMoment: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["weightedMoment", "totalWeight", "meanMoment", "defined"],
} as const;
/** Calculate residual score moment term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residuals, scoreComponents, weights } = request;
  const compute = (): Output => {
    H.sameLength(residuals, scoreComponents);
    H.sameLength(residuals, weights);
    H.domain(weights.every((x) => x >= 0));
    return (() => {
      const weightedMoment = residuals.reduce(
          (s, x, i) => s + x * scoreComponents[i] * weights[i],
          0,
        ),
        totalWeight = weights.reduce((a, b) => a + b, 0);
      return {
        weightedMoment,
        totalWeight,
        meanMoment: totalWeight > 0 ? weightedMoment / totalWeight : 0,
        defined: totalWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { residuals: [1, -1], scoreComponents: [2, 3], weights: [1, 2] },
  output: {
    weightedMoment: -4,
    totalWeight: 3,
    meanMoment: -1.3333333333333333,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const residualScoreMomentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/residual-score-moment-term",
    title: "Residual Score Moment Term Tool",
    description:
      "Calculate residual score moment term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residuals: { type: "array", maxItems: 256, items: { type: "number" } },
        scoreComponents: {
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
      required: ["residuals", "scoreComponents", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedMoment: { type: "number" },
        totalWeight: { type: "number" },
        meanMoment: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["weightedMoment", "totalWeight", "meanMoment", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "residuals",
          label: "Residuals",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "scoreComponents",
          label: "Score Components",
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
          id: "weightedMoment",
          label: "Weighted Moment",
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "meanMoment",
          label: "Mean Moment",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = residualScoreMomentTermTool.execute;
export default residualScoreMomentTermTool;
