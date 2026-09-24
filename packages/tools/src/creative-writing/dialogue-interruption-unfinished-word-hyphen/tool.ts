import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fragment: string; readonly marker: string };
export type Output = { readonly marked: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fragment: { type: "string", maxLength: 8192 },
    marker: { type: "string", maxLength: 8192 },
  },
  required: ["fragment", "marker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { marked: { type: "string", maxLength: 8192 } },
  required: ["marked"],
} as const;
/** Append an explicit interruption marker once, without inferring token completeness or editorial punctuation rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fragment, marker } = request;
  const compute = (): Output => {
    H.domain(fragment.length > 0 && marker.length > 0);
    return { marked: fragment.endsWith(marker) ? fragment : fragment + marker };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fragment: "hel", marker: "—" },
  output: { marked: "hel—" },
} satisfies ToolExample<Input, Output>;
export const dialogueInterruptionUnfinishedWordHyphenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "creative-writing/dialogue-interruption-unfinished-word-hyphen",
      title: "Dialogue Interruption Unfinished Word Hyphen Tool",
      description:
        "Append an explicit interruption marker once, without inferring token completeness or editorial punctuation rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fragment: { type: "string", maxLength: 8192 },
          marker: { type: "string", maxLength: 8192 },
        },
        required: ["fragment", "marker"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { marked: { type: "string", maxLength: 8192 } },
        required: ["marked"],
      },
      ports: {
        inputs: [
          {
            id: "fragment",
            label: "Fragment",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "marker",
            label: "Marker",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "marked", label: "Marked", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = dialogueInterruptionUnfinishedWordHyphenTool.execute;
export default dialogueInterruptionUnfinishedWordHyphenTool;
