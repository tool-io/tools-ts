import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly targetId: string;
  readonly occurrenceIndex: number;
  readonly directed: boolean;
};
export type Output = { readonly edgeKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    targetId: { type: "string", maxLength: 8192, minLength: 1 },
    occurrenceIndex: { type: "integer", minimum: 0 },
    directed: { type: "boolean" },
  },
  required: ["sourceId", "targetId", "occurrenceIndex", "directed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edgeKey: { type: "string", maxLength: 8192 } },
  required: ["edgeKey"],
} as const;
/** Build an explicit multigraph edge occurrence key, canonicalizing undirected endpoints by UTF-16 lexical order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, targetId, occurrenceIndex, directed } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0 && targetId.length > 0, "sourceId");
    (H.domain(
      Number.isSafeInteger(occurrenceIndex) &&
        occurrenceIndex >= 0 &&
        occurrenceIndex <= Number.MAX_SAFE_INTEGER,
      "occurrenceIndex",
    ),
      occurrenceIndex);
    return {
      edgeKey: JSON.stringify([
        directed ? sourceId : sourceId <= targetId ? sourceId : targetId,
        directed ? targetId : sourceId <= targetId ? targetId : sourceId,
        occurrenceIndex,
        directed,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "B", targetId: "A", occurrenceIndex: 2, directed: false },
  output: { edgeKey: '["A","B",2,false]' },
} satisfies ToolExample<Input, Output>;
export const multigraphEdgeKeyOccurrenceSuffixTool = H.defineSchemaCalculation<
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
    id: "graph/multigraph-edge-key-occurrence-suffix",
    title: "Multigraph Edge Key Occurrence Suffix",
    description:
      "Build an explicit multigraph edge occurrence key, canonicalizing undirected endpoints by UTF-16 lexical order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        targetId: { type: "string", maxLength: 8192, minLength: 1 },
        occurrenceIndex: { type: "integer", minimum: 0 },
        directed: { type: "boolean" },
      },
      required: ["sourceId", "targetId", "occurrenceIndex", "directed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { edgeKey: { type: "string", maxLength: 8192 } },
      required: ["edgeKey"],
    },
    ports: {
      inputs: [
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetId",
          label: "Target Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "occurrenceIndex",
          label: "Occurrence Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "directed",
          label: "Directed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "edgeKey", label: "Edge Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = multigraphEdgeKeyOccurrenceSuffixTool.execute;
export default multigraphEdgeKeyOccurrenceSuffixTool;
