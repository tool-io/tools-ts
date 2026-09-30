import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = {
  readonly first: number;
  readonly exclusiveEnd: number;
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: ["start", "end", "includeStart", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer" },
    exclusiveEnd: { type: "integer" },
    count: { type: "integer" },
  },
  required: ["first", "exclusiveEnd", "count"],
} as const;
/** Calculate list marker delimited span endpoint from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { start, end, includeStart, includeEnd } = input;
  const compute = (): Output => {
    H.integer(start, 0);
    H.integer(end, start);
    const first = start + (includeStart ? 0 : 1),
      exclusiveEnd = end + (includeEnd ? 1 : 0);
    return { first, exclusiveEnd, count: Math.max(0, exclusiveEnd - first) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: 2, end: 6, includeStart: false, includeEnd: false },
  output: { first: 3, exclusiveEnd: 6, count: 3 },
} satisfies ToolExample<Input, Output>;
export const listMarkerDelimitedSpanEndpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-marker-delimited-span-endpoint",
    title: "List Marker Delimited Span Endpoint Tool",
    description:
      "Calculate list marker delimited span endpoint from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer", minimum: 0 },
        end: { type: "integer" },
        includeStart: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: ["start", "end", "includeStart", "includeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer" },
        exclusiveEnd: { type: "integer" },
        count: { type: "integer" },
      },
      required: ["first", "exclusiveEnd", "count"],
    },
    ports: {
      inputs: [
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
        {
          id: "includeStart",
          label: "Include Start",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "first", label: "First", valueType: { type: "integer" } },
        {
          id: "exclusiveEnd",
          label: "Exclusive End",
          valueType: { type: "integer" },
        },
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listMarkerDelimitedSpanEndpointTool.execute;
export default listMarkerDelimitedSpanEndpointTool;
