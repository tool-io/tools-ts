import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string; readonly cursor: number };
export type Output = {
  readonly insideCluster: boolean;
  readonly start: number;
  readonly end: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    cursor: { type: "integer", minimum: 0 },
  },
  required: ["text", "cursor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideCluster: { type: "boolean" },
    start: { type: "integer" },
    end: { type: "integer" },
  },
  required: ["insideCluster", "start", "end"],
} as const;
/** Compute grapheme cursor mid cluster flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text, cursor } = input;
  const compute = (): Output => {
    integer(cursor, 0, text.length);
    const segments = [
      ...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text),
    ];
    const s = segments.find(
      (x) => cursor > x.index && cursor < x.index + x.segment.length,
    );
    return {
      insideCluster: !!s,
      start: s?.index ?? cursor,
      end: s ? s.index + s.segment.length : cursor,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "áb", cursor: 1 },
  output: { insideCluster: true, start: 0, end: 2 },
} satisfies ToolExample<Input, Output>;
export const graphemeCursorMidClusterFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/grapheme-cursor-mid-cluster-flag",
  title: "Grapheme Cursor Mid Cluster Flag Tool",
  description:
    "Compute grapheme cursor mid cluster flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "cursor",
        label: "Cursor",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "insideCluster",
        label: "Inside Cluster",
        valueType: { type: "boolean" },
      },
      { id: "start", label: "Start", valueType: { type: "integer" } },
      { id: "end", label: "End", valueType: { type: "integer" } },
    ],
  },
});
export const run = graphemeCursorMidClusterFlagTool.execute;
export default graphemeCursorMidClusterFlagTool;
