import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly offsets: readonly number[] };
export type Output = { readonly generationOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsets: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["offsets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { generationOffset: { type: "integer" } },
  required: ["generationOffset"],
} as const;
/** Sum caller-coded parent +1, child -1 and same-generation 0 edges without inferring kinship or descent conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offsets } = request;
  const compute = (): Output => {
    H.domain(offsets.every((x) => x >= -1 && x <= 1));
    return { generationOffset: offsets.reduce((a, b) => a + b, 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offsets: [1, 1, -1] },
  output: { generationOffset: 1 },
} satisfies ToolExample<Input, Output>;
export const kinshipEdgeGenerationalOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/kinship-edge-generational-offset",
    title: "Kinship Edge Generational Offset Tool",
    description:
      "Sum caller-coded parent +1, child -1 and same-generation 0 edges without inferring kinship or descent conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsets: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["offsets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { generationOffset: { type: "integer" } },
      required: ["generationOffset"],
    },
    ports: {
      inputs: [
        {
          id: "offsets",
          label: "Offsets",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "generationOffset",
          label: "Generation Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = kinshipEdgeGenerationalOffsetTool.execute;
export default kinshipEdgeGenerationalOffsetTool;
