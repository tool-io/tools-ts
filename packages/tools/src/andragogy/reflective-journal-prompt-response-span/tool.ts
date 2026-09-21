import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly start: number;
  readonly end: number;
};
export type Output = { readonly response: string; readonly codePoints: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
  },
  required: ["text", "start", "end"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    codePoints: { type: "integer" },
  },
  required: ["response", "codePoints"],
} as const;
/** Extract a caller-marked half-open Unicode code-point response span; no reflective-quality inference is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, start, end } = request;
  const compute = (): Output => {
    const characters = Array.from(text);
    H.integer(start, 0, characters.length);
    H.integer(end, start, characters.length);
    return {
      response: characters.slice(start, end).join(""),
      codePoints: end - start,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "Prompt: learned today", start: 8, end: 15 },
  output: { response: "learned", codePoints: 7 },
} satisfies ToolExample<Input, Output>;
export const reflectiveJournalPromptResponseSpanTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "andragogy/reflective-journal-prompt-response-span",
      title: "Reflective Journal Prompt Response Span Tool",
      description:
        "Extract a caller-marked half-open Unicode code-point response span; no reflective-quality inference is performed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          start: { type: "integer", minimum: 0 },
          end: { type: "integer" },
        },
        required: ["text", "start", "end"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          response: { type: "string", maxLength: 8192 },
          codePoints: { type: "integer" },
        },
        required: ["response", "codePoints"],
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
        ],
        outputs: [
          { id: "response", label: "Response", valueType: { type: "string" } },
          {
            id: "codePoints",
            label: "Code Points",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reflectiveJournalPromptResponseSpanTool.execute;
export default reflectiveJournalPromptResponseSpanTool;
