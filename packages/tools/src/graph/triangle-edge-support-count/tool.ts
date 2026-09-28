import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVertex: string;
  readonly secondVertex: string;
  readonly firstNeighbors: readonly string[];
  readonly secondNeighbors: readonly string[];
};
export type Output = {
  readonly supportCount: number;
  readonly commonNeighbors: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVertex: { type: "string", maxLength: 8192 },
    secondVertex: { type: "string", maxLength: 8192 },
    firstNeighbors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondNeighbors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "firstVertex",
    "secondVertex",
    "firstNeighbors",
    "secondNeighbors",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportCount: { type: "integer" },
    commonNeighbors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["supportCount", "commonNeighbors"],
} as const;
/** Count distinct supplied common neighbors supporting one simple undirected edge; no graph reconstruction or symmetry verification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVertex, secondVertex, firstNeighbors, secondNeighbors } =
    request;
  const compute = (): Output => {
    H.domain(firstVertex !== secondVertex);
    const commonNeighbors = [...new Set(firstNeighbors)].filter(
      (x) =>
        x !== firstVertex && x !== secondVertex && secondNeighbors.includes(x),
    );
    return { supportCount: commonNeighbors.length, commonNeighbors };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVertex: "A",
    secondVertex: "B",
    firstNeighbors: ["B", "C", "D"],
    secondNeighbors: ["A", "C", "E"],
  },
  output: { supportCount: 1, commonNeighbors: ["C"] },
} satisfies ToolExample<Input, Output>;
export const triangleEdgeSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/triangle-edge-support-count",
    title: "Triangle Edge Support Count Tool",
    description:
      "Count distinct supplied common neighbors supporting one simple undirected edge; no graph reconstruction or symmetry verification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVertex: { type: "string", maxLength: 8192 },
        secondVertex: { type: "string", maxLength: 8192 },
        firstNeighbors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondNeighbors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "firstVertex",
        "secondVertex",
        "firstNeighbors",
        "secondNeighbors",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportCount: { type: "integer" },
        commonNeighbors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["supportCount", "commonNeighbors"],
    },
    ports: {
      inputs: [
        {
          id: "firstVertex",
          label: "First Vertex",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondVertex",
          label: "Second Vertex",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstNeighbors",
          label: "First Neighbors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondNeighbors",
          label: "Second Neighbors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "supportCount",
          label: "Support Count",
          valueType: { type: "integer" },
        },
        {
          id: "commonNeighbors",
          label: "Common Neighbors",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = triangleEdgeSupportCountTool.execute;
export default triangleEdgeSupportCountTool;
