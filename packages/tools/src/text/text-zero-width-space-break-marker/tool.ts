import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly indexes: readonly number[];
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
    count: { type: "integer" },
  },
  required: ["indexes", "count"],
} as const;
/** Calculate text zero width space break marker from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    const indexes: number[] = [];
    for (let i = 0; i < text.length; i++)
      if (text.charCodeAt(i) === 8203) indexes.push(i);
    return { indexes, count: indexes.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "ab​cd​" },
  output: { indexes: [2, 5], count: 2 },
} satisfies ToolExample<Input, Output>;
export const textZeroWidthSpaceBreakMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/text-zero-width-space-break-marker",
    title: "Text Zero Width Space Break Marker Tool",
    description:
      "Calculate text zero width space break marker from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
        count: { type: "integer" },
      },
      required: ["indexes", "count"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "indexes",
          label: "Indexes",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = textZeroWidthSpaceBreakMarkerTool.execute;
export default textZeroWidthSpaceBreakMarkerTool;
