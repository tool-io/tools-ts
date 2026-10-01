import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly line: string;
  readonly allowLeadingSpace: boolean;
};
export type Output = { readonly comment: boolean; readonly marker: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line: { type: "string", maxLength: 8192 },
    allowLeadingSpace: { type: "boolean" },
  },
  required: ["line", "allowLeadingSpace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comment: { type: "boolean" },
    marker: { type: "string", maxLength: 8192 },
  },
  required: ["comment", "marker"],
} as const;
/** Apply an explicitly supplied leading-horizontal-whitespace policy for full-line INI comments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { line, allowLeadingSpace } = request;
  const compute = (): Output => {
    const inspected = allowLeadingSpace ? line.replace(/^[ \t]+/, "") : line,
      comment = inspected.startsWith(";") || inspected.startsWith("#");
    return { comment, marker: comment ? inspected[0] : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { line: "  ; note", allowLeadingSpace: true },
  output: { comment: true, marker: ";" },
} satisfies ToolExample<Input, Output>;
export const iniCommentLeadingSpacePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/ini-comment-leading-space-policy",
    title: "Ini Comment Leading Space Policy Tool",
    description:
      "Apply an explicitly supplied leading-horizontal-whitespace policy for full-line INI comments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        line: { type: "string", maxLength: 8192 },
        allowLeadingSpace: { type: "boolean" },
      },
      required: ["line", "allowLeadingSpace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comment: { type: "boolean" },
        marker: { type: "string", maxLength: 8192 },
      },
      required: ["comment", "marker"],
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
          id: "allowLeadingSpace",
          label: "Allow Leading Space",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "comment", label: "Comment", valueType: { type: "boolean" } },
        { id: "marker", label: "Marker", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = iniCommentLeadingSpacePolicyTool.execute;
export default iniCommentLeadingSpacePolicyTool;
