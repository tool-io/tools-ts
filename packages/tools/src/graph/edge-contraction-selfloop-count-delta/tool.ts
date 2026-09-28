import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgesBetween: number;
  readonly existingLoops: number;
  readonly keepContractedEdges: boolean;
};
export type Output = { readonly loops: number; readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgesBetween: { type: "integer", minimum: 1 },
    existingLoops: { type: "integer", minimum: 0 },
    keepContractedEdges: { type: "boolean" },
  },
  required: ["edgesBetween", "existingLoops", "keepContractedEdges"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loops: { type: "integer" }, delta: { type: "integer" } },
  required: ["loops", "delta"],
} as const;
/** Count local loops after merging endpoints; explicitly select whether contracted inter-endpoint edges survive as loops. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgesBetween, existingLoops, keepContractedEdges } = request;
  const compute = (): Output => {
    H.integer(edgesBetween, 1);
    H.integer(existingLoops, 0);
    const delta = keepContractedEdges ? edgesBetween : 0;
    return { loops: existingLoops + delta, delta };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgesBetween: 3, existingLoops: 2, keepContractedEdges: true },
  output: { loops: 5, delta: 3 },
} satisfies ToolExample<Input, Output>;
export const edgeContractionSelfloopCountDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-contraction-selfloop-count-delta",
    title: "Edge Contraction Selfloop Count Delta Tool",
    description:
      "Count local loops after merging endpoints; explicitly select whether contracted inter-endpoint edges survive as loops.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgesBetween: { type: "integer", minimum: 1 },
        existingLoops: { type: "integer", minimum: 0 },
        keepContractedEdges: { type: "boolean" },
      },
      required: ["edgesBetween", "existingLoops", "keepContractedEdges"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loops: { type: "integer" }, delta: { type: "integer" } },
      required: ["loops", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "edgesBetween",
          label: "Edges Between",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "existingLoops",
          label: "Existing Loops",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "keepContractedEdges",
          label: "Keep Contracted Edges",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "loops", label: "Loops", valueType: { type: "integer" } },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = edgeContractionSelfloopCountDeltaTool.execute;
export default edgeContractionSelfloopCountDeltaTool;
