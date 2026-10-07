import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceNodes: readonly number[];
  readonly referenceWeights: readonly number[];
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly nodes: readonly number[];
  readonly weights: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceNodes: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["referenceNodes", "referenceWeights", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["nodes", "weights"],
} as const;
/** Map explicit quadrature nodes and weights from [-1,1] to an increasing finite interval, applying the affine Jacobian without selecting a quadrature rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceNodes, referenceWeights, lower, upper } = request;
  const compute = (): Output => {
    H.domain(
      referenceNodes.length === referenceWeights.length,
      "referenceWeights",
    );
    H.domain(upper > lower, "upper");
    H.domain(
      referenceNodes.every((v) => v >= -1 && v <= 1),
      "referenceNodes",
    );
    const half = upper / 2 - lower / 2,
      mid = lower / 2 + upper / 2;
    return {
      nodes: referenceNodes.map((v) => mid + half * v),
      weights: referenceWeights.map((v) => half * v),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceNodes: [-1, 0, 1],
    referenceWeights: [1, 4, 1],
    lower: 2,
    upper: 4,
  },
  output: { nodes: [2, 3, 4], weights: [1, 4, 1] },
} satisfies ToolExample<Input, Output>;
export const quadratureNodeAffineMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/quadrature-node-affine-map",
    title: "Quadrature Node Affine Map",
    description:
      "Map explicit quadrature nodes and weights from [-1,1] to an increasing finite interval, applying the affine Jacobian without selecting a quadrature rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceNodes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["referenceNodes", "referenceWeights", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["nodes", "weights"],
    },
    ports: {
      inputs: [
        {
          id: "referenceNodes",
          label: "Reference Nodes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceWeights",
          label: "Reference Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nodes",
          label: "Nodes",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = quadratureNodeAffineMapTool.execute;
export default quadratureNodeAffineMapTool;
