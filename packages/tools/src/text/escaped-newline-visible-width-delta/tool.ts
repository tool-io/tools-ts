import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly newlineVisibleWidth: number;
};
export type Output = {
  readonly newlineCount: number;
  readonly originalCodeUnits: number;
  readonly displayedCodeUnits: number;
  readonly delta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    newlineVisibleWidth: { type: "integer", minimum: 0 },
  },
  required: ["text", "newlineVisibleWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newlineCount: { type: "integer" },
    originalCodeUnits: { type: "integer" },
    displayedCodeUnits: { type: "integer" },
    delta: { type: "integer" },
  },
  required: [
    "newlineCount",
    "originalCodeUnits",
    "displayedCodeUnits",
    "delta",
  ],
} as const;
/** Count visible UTF-16 width after replacing each CRLF, CR or LF with an explicitly supplied display token width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, newlineVisibleWidth } = request;
  const compute = (): Output => {
    H.integer(newlineVisibleWidth, 0);
    const newlineCount = (text.match(/\r\n|\r|\n/g) || []).length,
      removed = (text.match(/\r\n|\r|\n/g) || []).reduce(
        (s, x) => s + x.length,
        0,
      ),
      displayedCodeUnits =
        text.length - removed + newlineCount * newlineVisibleWidth;
    return {
      newlineCount,
      originalCodeUnits: text.length,
      displayedCodeUnits,
      delta: displayedCodeUnits - text.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "a\r\nb\n", newlineVisibleWidth: 2 },
  output: {
    newlineCount: 2,
    originalCodeUnits: 5,
    displayedCodeUnits: 6,
    delta: 1,
  },
} satisfies ToolExample<Input, Output>;
export const escapedNewlineVisibleWidthDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/escaped-newline-visible-width-delta",
    title: "Escaped Newline Visible Width Delta Tool",
    description:
      "Count visible UTF-16 width after replacing each CRLF, CR or LF with an explicitly supplied display token width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        newlineVisibleWidth: { type: "integer", minimum: 0 },
      },
      required: ["text", "newlineVisibleWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newlineCount: { type: "integer" },
        originalCodeUnits: { type: "integer" },
        displayedCodeUnits: { type: "integer" },
        delta: { type: "integer" },
      },
      required: [
        "newlineCount",
        "originalCodeUnits",
        "displayedCodeUnits",
        "delta",
      ],
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
          id: "newlineVisibleWidth",
          label: "Newline Visible Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "newlineCount",
          label: "Newline Count",
          valueType: { type: "integer" },
        },
        {
          id: "originalCodeUnits",
          label: "Original Code Units",
          valueType: { type: "integer" },
        },
        {
          id: "displayedCodeUnits",
          label: "Displayed Code Units",
          valueType: { type: "integer" },
        },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = escapedNewlineVisibleWidthDeltaTool.execute;
export default escapedNewlineVisibleWidthDeltaTool;
