import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snippetText: string;
  readonly startCodePoint: number;
  readonly endCodePoint: number;
};
export type Output = {
  readonly before: string;
  readonly highlighted: string;
  readonly after: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snippetText: { type: "string", maxLength: 8192 },
    startCodePoint: { type: "integer", minimum: 0 },
    endCodePoint: { type: "integer" },
  },
  required: ["snippetText", "startCodePoint", "endCodePoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "string", maxLength: 8192 },
    highlighted: { type: "string", maxLength: 8192 },
    after: { type: "string", maxLength: 8192 },
  },
  required: ["before", "highlighted", "after"],
} as const;
/** Split a supplied search snippet at explicit half-open Unicode code-point offsets, returning plain text segments without markup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { snippetText, startCodePoint, endCodePoint } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startCodePoint) &&
        startCodePoint >= 0 &&
        startCodePoint <= Array.from(snippetText).length,
      "startCodePoint",
    ),
      startCodePoint);
    (H.domain(
      Number.isSafeInteger(endCodePoint) &&
        endCodePoint >= startCodePoint &&
        endCodePoint <= Array.from(snippetText).length,
      "endCodePoint",
    ),
      endCodePoint);
    return (() => {
      const characters = Array.from(snippetText);
      return {
        before: characters.slice(0, startCodePoint).join(""),
        highlighted: characters.slice(startCodePoint, endCodePoint).join(""),
        after: characters.slice(endCodePoint).join(""),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { snippetText: "Hello world", startCodePoint: 6, endCodePoint: 11 },
  output: { before: "Hello ", highlighted: "world", after: "" },
} satisfies ToolExample<Input, Output>;
export const searchSnippetHighlightOffsetPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/search-snippet-highlight-offset-pair",
    title: "Search Snippet Highlight Offset Pair Tool",
    description:
      "Split a supplied search snippet at explicit half-open Unicode code-point offsets, returning plain text segments without markup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snippetText: { type: "string", maxLength: 8192 },
        startCodePoint: { type: "integer", minimum: 0 },
        endCodePoint: { type: "integer" },
      },
      required: ["snippetText", "startCodePoint", "endCodePoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "string", maxLength: 8192 },
        highlighted: { type: "string", maxLength: 8192 },
        after: { type: "string", maxLength: 8192 },
      },
      required: ["before", "highlighted", "after"],
    },
    ports: {
      inputs: [
        {
          id: "snippetText",
          label: "Snippet Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startCodePoint",
          label: "Start Code Point",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endCodePoint",
          label: "End Code Point",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "before", label: "Before", valueType: { type: "string" } },
        {
          id: "highlighted",
          label: "Highlighted",
          valueType: { type: "string" },
        },
        { id: "after", label: "After", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = searchSnippetHighlightOffsetPairTool.execute;
export default searchSnippetHighlightOffsetPairTool;
