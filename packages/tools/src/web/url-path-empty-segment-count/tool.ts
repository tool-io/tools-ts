import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly path: string;
  readonly includeLeading: boolean;
  readonly includeTrailing: boolean;
};
export type Output = { readonly emptySegments: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    path: { type: "string", maxLength: 8192 },
    includeLeading: { type: "boolean" },
    includeTrailing: { type: "boolean" },
  },
  required: ["path", "includeLeading", "includeTrailing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { emptySegments: { type: "integer" } },
  required: ["emptySegments"],
} as const;
/** Count literal empty slash-delimited path segments with explicit endpoint inclusion; do not parse a full URL. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { path, includeLeading, includeTrailing } = request;
  const compute = (): Output => {
    const a = path.split("/");
    return {
      emptySegments: a.filter(
        (x, i) =>
          x === "" &&
          (i !== 0 || includeLeading) &&
          (i !== a.length - 1 || includeTrailing),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { path: "/a//b/", includeLeading: false, includeTrailing: false },
  output: { emptySegments: 1 },
} satisfies ToolExample<Input, Output>;
export const urlPathEmptySegmentCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/url-path-empty-segment-count",
    title: "URL Path Empty Segment Count Tool",
    description:
      "Count literal empty slash-delimited path segments with explicit endpoint inclusion; do not parse a full URL.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        path: { type: "string", maxLength: 8192 },
        includeLeading: { type: "boolean" },
        includeTrailing: { type: "boolean" },
      },
      required: ["path", "includeLeading", "includeTrailing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { emptySegments: { type: "integer" } },
      required: ["emptySegments"],
    },
    ports: {
      inputs: [
        {
          id: "path",
          label: "Path",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "includeLeading",
          label: "Include Leading",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeTrailing",
          label: "Include Trailing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "emptySegments",
          label: "Empty Segments",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = urlPathEmptySegmentCountTool.execute;
export default urlPathEmptySegmentCountTool;
