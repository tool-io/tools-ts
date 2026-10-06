import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly suppliedTextSpan: string;
  readonly commentaryMarker: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTextSpan: { type: "string", maxLength: 8192, minLength: 1 },
    commentaryMarker: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "suppliedTextSpan", "commentaryMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit commentary placement annotation without inferring textual layers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, suppliedTextSpan, commentaryMarker } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(suppliedTextSpan.length > 0, "suppliedTextSpan");
    H.domain(commentaryMarker.length > 0, "commentaryMarker");
    return {
      token: JSON.stringify([sourceId, suppliedTextSpan, commentaryMarker]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "SRC17",
    suppliedTextSpan: "Text A",
    commentaryMarker: "interlinear",
  },
  output: { token: '["SRC17","Text A","interlinear"]' },
} satisfies ToolExample<Input, Output>;
export const chineseCommentaryInterlinearMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/chinese-commentary-interlinear-marker",
    title: "Chinese Commentary Interlinear Marker",
    description:
      "Preserve an explicit commentary placement annotation without inferring textual layers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTextSpan: { type: "string", maxLength: 8192, minLength: 1 },
        commentaryMarker: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "suppliedTextSpan", "commentaryMarker"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "suppliedTextSpan",
          label: "Supplied Text Span",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "commentaryMarker",
          label: "Commentary Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chineseCommentaryInterlinearMarkerTool.execute;
export default chineseCommentaryInterlinearMarkerTool;
