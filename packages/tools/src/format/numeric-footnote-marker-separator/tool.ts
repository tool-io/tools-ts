import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly marker: string;
  readonly thinSpace: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    marker: { type: "string", maxLength: 8192 },
    thinSpace: { type: "boolean" },
  },
  required: ["value", "marker", "thinSpace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate numeric footnote marker separator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, marker, thinSpace } = request;
  const compute = (): Output => {
    H.domain(marker.length > 0 && !/[\r\n]/.test(marker));
    return { text: value + (thinSpace ? "\u2009" : "") + marker };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: "12", marker: "*", thinSpace: true },
  output: { text: "12 *" },
} satisfies ToolExample<Input, Output>;
export const numericFootnoteMarkerSeparatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/numeric-footnote-marker-separator",
    title: "Numeric Footnote Marker Separator Tool",
    description:
      "Calculate numeric footnote marker separator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        marker: { type: "string", maxLength: 8192 },
        thinSpace: { type: "boolean" },
      },
      required: ["value", "marker", "thinSpace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
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
          id: "thinSpace",
          label: "Thin Space",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = numericFootnoteMarkerSeparatorTool.execute;
export default numericFootnoteMarkerSeparatorTool;
