import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgeSources: readonly string[];
  readonly edgeTargets: readonly string[];
};
export type Output = {
  readonly continuous: boolean;
  readonly breakAfterIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeSources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    edgeTargets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["edgeSources", "edgeTargets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    continuous: { type: "boolean" },
    breakAfterIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["continuous", "breakAfterIndices"],
} as const;
/** Check exact consecutive endpoint continuity of an explicitly ordered directed edge list, accepting an empty walk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeSources, edgeTargets } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(edgeSources.length === edgeTargets.length, "edgeTargets");
      const breakAfterIndices = edgeTargets.flatMap((target, i) =>
        i + 1 < edgeSources.length && target !== edgeSources[i + 1] ? [i] : [],
      );
      return { continuous: breakAfterIndices.length === 0, breakAfterIndices };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeSources: ["A", "B", "X"], edgeTargets: ["B", "C", "Y"] },
  output: { continuous: false, breakAfterIndices: [1] },
} satisfies ToolExample<Input, Output>;
export const graphWalkEdgeContinuityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["graph", "mathematics"],
      keywords: ["graph", "mathematics"],
    },
    id: "graph/graph-walk-edge-continuity",
    title: "Graph Walk Edge Continuity",
    description:
      "Check exact consecutive endpoint continuity of an explicitly ordered directed edge list, accepting an empty walk.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeSources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        edgeTargets: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["edgeSources", "edgeTargets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        continuous: { type: "boolean" },
        breakAfterIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["continuous", "breakAfterIndices"],
    },
    ports: {
      inputs: [
        {
          id: "edgeSources",
          label: "Edge Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "edgeTargets",
          label: "Edge Targets",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "continuous",
          label: "Continuous",
          valueType: { type: "boolean" },
        },
        {
          id: "breakAfterIndices",
          label: "Break After Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = graphWalkEdgeContinuityTool.execute;
export default graphWalkEdgeContinuityTool;
