import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstId: string;
  readonly secondId: string;
  readonly firstFrom: string;
  readonly firstTo: string;
  readonly secondFrom: string;
  readonly secondTo: string;
  readonly directed: boolean;
};
export type Output = {
  readonly sameIdentity: boolean;
  readonly parallelEndpoints: boolean;
  readonly distinctParallelEdges: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstId: { type: "string", maxLength: 8192 },
    secondId: { type: "string", maxLength: 8192 },
    firstFrom: { type: "string", maxLength: 8192 },
    firstTo: { type: "string", maxLength: 8192 },
    secondFrom: { type: "string", maxLength: 8192 },
    secondTo: { type: "string", maxLength: 8192 },
    directed: { type: "boolean" },
  },
  required: [
    "firstId",
    "secondId",
    "firstFrom",
    "firstTo",
    "secondFrom",
    "secondTo",
    "directed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameIdentity: { type: "boolean" },
    parallelEndpoints: { type: "boolean" },
    distinctParallelEdges: { type: "boolean" },
  },
  required: ["sameIdentity", "parallelEndpoints", "distinctParallelEdges"],
} as const;
/** Distinguish explicit edge identity from endpoint coincidence in a directed or undirected multigraph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstId,
    secondId,
    firstFrom,
    firstTo,
    secondFrom,
    secondTo,
    directed,
  } = request;
  const compute = (): Output => {
    const sameIdentity = firstId === secondId,
      parallelEndpoints =
        (firstFrom === secondFrom && firstTo === secondTo) ||
        (!directed && firstFrom === secondTo && firstTo === secondFrom);
    return {
      sameIdentity,
      parallelEndpoints,
      distinctParallelEdges: !sameIdentity && parallelEndpoints,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstId: "e1",
    secondId: "e2",
    firstFrom: "A",
    firstTo: "B",
    secondFrom: "B",
    secondTo: "A",
    directed: false,
  },
  output: {
    sameIdentity: false,
    parallelEndpoints: true,
    distinctParallelEdges: true,
  },
} satisfies ToolExample<Input, Output>;
export const multigraphParallelEdgeIdentityTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/multigraph-parallel-edge-identity-token",
      title: "Multigraph Parallel Edge Identity Token Tool",
      description:
        "Distinguish explicit edge identity from endpoint coincidence in a directed or undirected multigraph.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstId: { type: "string", maxLength: 8192 },
          secondId: { type: "string", maxLength: 8192 },
          firstFrom: { type: "string", maxLength: 8192 },
          firstTo: { type: "string", maxLength: 8192 },
          secondFrom: { type: "string", maxLength: 8192 },
          secondTo: { type: "string", maxLength: 8192 },
          directed: { type: "boolean" },
        },
        required: [
          "firstId",
          "secondId",
          "firstFrom",
          "firstTo",
          "secondFrom",
          "secondTo",
          "directed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameIdentity: { type: "boolean" },
          parallelEndpoints: { type: "boolean" },
          distinctParallelEdges: { type: "boolean" },
        },
        required: [
          "sameIdentity",
          "parallelEndpoints",
          "distinctParallelEdges",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstId",
            label: "First Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondId",
            label: "Second Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstFrom",
            label: "First From",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstTo",
            label: "First To",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondFrom",
            label: "Second From",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondTo",
            label: "Second To",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "directed",
            label: "Directed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "sameIdentity",
            label: "Same Identity",
            valueType: { type: "boolean" },
          },
          {
            id: "parallelEndpoints",
            label: "Parallel Endpoints",
            valueType: { type: "boolean" },
          },
          {
            id: "distinctParallelEdges",
            label: "Distinct Parallel Edges",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = multigraphParallelEdgeIdentityTokenTool.execute;
export default multigraphParallelEdgeIdentityTokenTool;
