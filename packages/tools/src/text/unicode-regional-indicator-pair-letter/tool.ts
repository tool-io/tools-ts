import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly letters: string; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    letters: { type: "string", maxLength: 8192 },
    valid: { type: "boolean" },
  },
  required: ["letters", "valid"],
} as const;
/** Decode the two regional-indicator letters without asserting that the pair denotes a registered country or rendered flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    const p = Array.from(text),
      valid =
        p.length === 2 &&
        p.every((c) => {
          const n = c.codePointAt(0);
          return n !== undefined && n >= 127462 && n <= 127487;
        });
    return {
      letters: valid
        ? p
            .map((c) =>
              String.fromCharCode((c.codePointAt(0) ?? 127462) - 127462 + 65),
            )
            .join("")
        : "",
      valid,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "🇺🇸" },
  output: { letters: "US", valid: true },
} satisfies ToolExample<Input, Output>;
export const unicodeRegionalIndicatorPairLetterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-regional-indicator-pair-letter",
    title: "Unicode Regional Indicator Pair Letter Tool",
    description:
      "Decode the two regional-indicator letters without asserting that the pair denotes a registered country or rendered flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        letters: { type: "string", maxLength: 8192 },
        valid: { type: "boolean" },
      },
      required: ["letters", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "letters", label: "Letters", valueType: { type: "string" } },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeRegionalIndicatorPairLetterTool.execute;
export default unicodeRegionalIndicatorPairLetterTool;
