import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly walk: readonly string[];
  readonly vertex: string;
};
export type Output = {
  readonly positions: readonly number[];
  readonly occurrences: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walk: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    vertex: { type: "string", maxLength: 8192 },
  },
  required: ["walk", "vertex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positions: { type: "array", maxItems: 256, items: { type: "integer" } },
    occurrences: { type: "integer" },
  },
  required: ["positions", "occurrences"],
} as const;
/** Calculate graph walk vertex occurrence position from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { walk, vertex } = request;
  const compute = (): Output => {
    const positions = walk.flatMap((x, i) => (x === vertex ? [i] : []));
    return { positions, occurrences: positions.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { walk: ["a", "b", "a", "c"], vertex: "a" },
  output: { positions: [0, 2], occurrences: 2 },
} satisfies ToolExample<Input, Output>;
export const graphWalkVertexOccurrencePositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-walk-vertex-occurrence-position",
    title: "Graph Walk Vertex Occurrence Position Tool",
    description:
      "Calculate graph walk vertex occurrence position from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        walk: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        vertex: { type: "string", maxLength: 8192 },
      },
      required: ["walk", "vertex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positions: { type: "array", maxItems: 256, items: { type: "integer" } },
        occurrences: { type: "integer" },
      },
      required: ["positions", "occurrences"],
    },
    ports: {
      inputs: [
        {
          id: "walk",
          label: "Walk",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "vertex",
          label: "Vertex",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "positions",
          label: "Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "occurrences",
          label: "Occurrences",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = graphWalkVertexOccurrencePositionTool.execute;
export default graphWalkVertexOccurrencePositionTool;
