import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nodeId: string;
  readonly generation: number;
  readonly depth: number;
};
export type Output = { readonly label: string; readonly sameIndex: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodeId: { type: "string", maxLength: 8192, minLength: 1 },
    generation: { type: "integer", minimum: 0 },
    depth: { type: "integer", minimum: 0 },
  },
  required: ["nodeId", "generation", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    sameIndex: { type: "boolean" },
  },
  required: ["label", "sameIndex"],
} as const;
/** Keep explicitly supplied biological generation and graph-depth indices distinct in a lineage-node label. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nodeId, generation, depth } = request;
  const compute = (): Output => {
    H.domain(nodeId.length > 0, "nodeId");
    (H.domain(
      Number.isSafeInteger(generation) &&
        generation >= 0 &&
        generation <= Number.MAX_SAFE_INTEGER,
      "generation",
    ),
      generation);
    (H.domain(
      Number.isSafeInteger(depth) &&
        depth >= 0 &&
        depth <= Number.MAX_SAFE_INTEGER,
      "depth",
    ),
      depth);
    return {
      label: nodeId + "; generation=" + generation + "; depth=" + depth,
      sameIndex: generation === depth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nodeId: "N17", generation: 3, depth: 4 },
  output: { label: "N17; generation=3; depth=4", sameIndex: false },
} satisfies ToolExample<Input, Output>;
export const lineageNodeGenerationDepthLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/lineage-node-generation-depth-label",
    title: "Lineage Node Generation Depth Label",
    description:
      "Keep explicitly supplied biological generation and graph-depth indices distinct in a lineage-node label.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodeId: { type: "string", maxLength: 8192, minLength: 1 },
        generation: { type: "integer", minimum: 0 },
        depth: { type: "integer", minimum: 0 },
      },
      required: ["nodeId", "generation", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        sameIndex: { type: "boolean" },
      },
      required: ["label", "sameIndex"],
    },
    ports: {
      inputs: [
        {
          id: "nodeId",
          label: "Node Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "generation",
          label: "Generation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "sameIndex",
          label: "Same Index",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = lineageNodeGenerationDepthLabelTool.execute;
export default lineageNodeGenerationDepthLabelTool;
