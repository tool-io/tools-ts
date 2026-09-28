import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly neighborIds: readonly string[];
  readonly neighborDegrees: readonly number[];
};
export type Output = {
  readonly degreeSumDecimal: string;
  readonly distinctNeighbors: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neighborIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    neighborDegrees: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
  },
  required: ["neighborIds", "neighborDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degreeSumDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    distinctNeighbors: { type: "integer" },
  },
  required: ["degreeSumDecimal", "distinctNeighbors"],
} as const;
/** Sum explicitly supplied distinct-neighbor degrees without reconstructing a graph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { neighborIds, neighborDegrees } = request;
  const compute = (): Output => {
    H.sameLength(neighborIds, neighborDegrees);
    H.domain(
      new Set(neighborIds).size === neighborIds.length &&
        neighborDegrees.every((x) => x >= 0),
    );
    return {
      degreeSumDecimal: neighborDegrees
        .reduce((s, n) => s + BigInt(n), 0n)
        .toString(),
      distinctNeighbors: neighborIds.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { neighborIds: ["a", "b"], neighborDegrees: [3, 4] },
  output: { degreeSumDecimal: "7", distinctNeighbors: 2 },
} satisfies ToolExample<Input, Output>;
export const vertexNeighborDegreeSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/vertex-neighbor-degree-sum",
    title: "Vertex Neighbor Degree Sum Tool",
    description:
      "Sum explicitly supplied distinct-neighbor degrees without reconstructing a graph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neighborIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        neighborDegrees: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
      },
      required: ["neighborIds", "neighborDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degreeSumDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        distinctNeighbors: { type: "integer" },
      },
      required: ["degreeSumDecimal", "distinctNeighbors"],
    },
    ports: {
      inputs: [
        {
          id: "neighborIds",
          label: "Neighbor Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "neighborDegrees",
          label: "Neighbor Degrees",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "degreeSumDecimal",
          label: "Degree Sum Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "distinctNeighbors",
          label: "Distinct Neighbors",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = vertexNeighborDegreeSumTool.execute;
export default vertexNeighborDegreeSumTool;
