import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly line: string;
  readonly marker: string;
  readonly allowSpaces: boolean;
};
export type Output = { readonly depth: number; readonly content: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line: { type: "string", maxLength: 8192 },
    marker: { type: "string", maxLength: 8192 },
    allowSpaces: { type: "boolean" },
  },
  required: ["line", "marker", "allowSpaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer" },
    content: { type: "string", maxLength: 8192 },
  },
  required: ["depth", "content"],
} as const;
/** Count literal leading reply markers under an explicit ASCII-space policy, without claiming Markdown parsing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { line, marker, allowSpaces } = request;
  const compute = (): Output => {
    H.domain(marker.length === 1 && marker !== " ");
    let i = 0,
      depth = 0;
    while (i < line.length) {
      if (allowSpaces && line[i] === " ") {
        i++;
        continue;
      }
      if (line[i] !== marker) break;
      depth++;
      i++;
    }
    return { depth, content: line.slice(i) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { line: "> > hello", marker: ">", allowSpaces: true },
  output: { depth: 2, content: "hello" },
} satisfies ToolExample<Input, Output>;
export const quotedReplyDepthCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/quoted-reply-depth-count",
    title: "Quoted Reply Depth Count Tool",
    description:
      "Count literal leading reply markers under an explicit ASCII-space policy, without claiming Markdown parsing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        line: { type: "string", maxLength: 8192 },
        marker: { type: "string", maxLength: 8192 },
        allowSpaces: { type: "boolean" },
      },
      required: ["line", "marker", "allowSpaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        content: { type: "string", maxLength: 8192 },
      },
      required: ["depth", "content"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "marker",
          label: "Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowSpaces",
          label: "Allow Spaces",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        { id: "content", label: "Content", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = quotedReplyDepthCountTool.execute;
export default quotedReplyDepthCountTool;
