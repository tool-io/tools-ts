import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string; readonly toGlyph: boolean };
export type Output = { readonly text: string; readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    toGlyph: { type: "boolean" },
  },
  required: ["text", "toGlyph"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    count: { type: "integer" },
  },
  required: ["text", "count"],
} as const;
/** Calculate typographic ellipsis three dot crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, toGlyph } = request;
  const compute = (): Output => {
    const token = toGlyph ? "..." : "…",
      count = text.split(token).length - 1;
    return { text: text.replaceAll(token, toGlyph ? "…" : "..."), count };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "Wait... yes...", toGlyph: true },
  output: { text: "Wait… yes…", count: 2 },
} satisfies ToolExample<Input, Output>;
export const typographicEllipsisThreeDotCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "text/typographic-ellipsis-three-dot-crosswalk",
      title: "Typographic Ellipsis Three Dot Crosswalk Tool",
      description:
        "Calculate typographic ellipsis three dot crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          toGlyph: { type: "boolean" },
        },
        required: ["text", "toGlyph"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          count: { type: "integer" },
        },
        required: ["text", "count"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "toGlyph",
            label: "To Glyph",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "text", label: "Text", valueType: { type: "string" } },
          { id: "count", label: "Count", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = typographicEllipsisThreeDotCrosswalkTool.execute;
export default typographicEllipsisThreeDotCrosswalkTool;
