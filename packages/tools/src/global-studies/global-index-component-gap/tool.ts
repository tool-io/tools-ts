import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentValues: readonly number[];
  readonly weights: readonly number[];
  readonly publishedIndex: number;
};
export type Output = {
  readonly weightedSum: number;
  readonly totalWeight: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentValues: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    publishedIndex: { type: "number" },
  },
  required: ["componentValues", "weights", "publishedIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedSum: { type: "number" },
    totalWeight: { type: "number" },
    residual: { type: "number" },
  },
  required: ["weightedSum", "totalWeight", "residual"],
} as const;
/** Calculate global index component gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentValues, weights, publishedIndex } = request;
  const compute = (): Output => {
    H.sameLength(componentValues, weights);
    H.domain(weights.every((x) => x >= 0));
    return (() => {
      const weightedSum = componentValues.reduce(
        (s, x, i) => s + x * weights[i],
        0,
      );
      return {
        weightedSum,
        totalWeight: weights.reduce((a, b) => a + b, 0),
        residual: publishedIndex - weightedSum,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentValues: [2, 4],
    weights: [0.25, 0.75],
    publishedIndex: 3.4,
  },
  output: { weightedSum: 3.5, totalWeight: 1, residual: -0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const globalIndexComponentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-index-component-gap",
    title: "Global Index Component Gap Tool",
    description:
      "Calculate global index component gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentValues: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        publishedIndex: { type: "number" },
      },
      required: ["componentValues", "weights", "publishedIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedSum: { type: "number" },
        totalWeight: { type: "number" },
        residual: { type: "number" },
      },
      required: ["weightedSum", "totalWeight", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "componentValues",
          label: "Component Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "publishedIndex",
          label: "Published Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedSum",
          label: "Weighted Sum",
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = globalIndexComponentGapTool.execute;
export default globalIndexComponentGapTool;
