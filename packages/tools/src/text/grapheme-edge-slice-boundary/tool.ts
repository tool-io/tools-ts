import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly graphemes: readonly string[];
  readonly start: number;
  readonly end: number;
};
export type Output = {
  readonly slice: string;
  readonly startUtf16: number;
  readonly endUtf16: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    graphemes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
  },
  required: ["graphemes", "start", "end"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slice: { type: "string", maxLength: 8192 },
    startUtf16: { type: "integer" },
    endUtf16: { type: "integer" },
  },
  required: ["slice", "startUtf16", "endUtf16"],
} as const;
/** Slice caller-segmented grapheme clusters and report UTF-16 edge offsets; segmentation correctness belongs to the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { graphemes, start, end } = request;
  const compute = (): Output => {
    H.integer(start, 0, graphemes.length);
    H.integer(end, start, graphemes.length);
    H.domain(graphemes.every((x) => x.length > 0));
    return {
      slice: graphemes.slice(start, end).join(""),
      startUtf16: graphemes.slice(0, start).join("").length,
      endUtf16: graphemes.slice(0, end).join("").length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { graphemes: ["A", "é", "👩‍🚀", "B"], start: 1, end: 3 },
  output: { slice: "é👩‍🚀", startUtf16: 1, endUtf16: 8 },
} satisfies ToolExample<Input, Output>;
export const graphemeEdgeSliceBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/grapheme-edge-slice-boundary",
    title: "Grapheme Edge Slice Boundary Tool",
    description:
      "Slice caller-segmented grapheme clusters and report UTF-16 edge offsets; segmentation correctness belongs to the caller.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        graphemes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        start: { type: "integer", minimum: 0 },
        end: { type: "integer" },
      },
      required: ["graphemes", "start", "end"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slice: { type: "string", maxLength: 8192 },
        startUtf16: { type: "integer" },
        endUtf16: { type: "integer" },
      },
      required: ["slice", "startUtf16", "endUtf16"],
    },
    ports: {
      inputs: [
        {
          id: "graphemes",
          label: "Graphemes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "slice", label: "Slice", valueType: { type: "string" } },
        {
          id: "startUtf16",
          label: "Start Utf16",
          valueType: { type: "integer" },
        },
        { id: "endUtf16", label: "End Utf16", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = graphemeEdgeSliceBoundaryTool.execute;
export default graphemeEdgeSliceBoundaryTool;
