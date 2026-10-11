import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceOffset: number;
  readonly insertedSourceCodeUnits: number;
};
export type Output = { readonly shiftedOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceOffset: { type: "integer", minimum: 0 },
    insertedSourceCodeUnits: { type: "integer" },
  },
  required: ["sourceOffset", "insertedSourceCodeUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shiftedOffset: { type: "integer" } },
  required: ["shiftedOffset"],
} as const;
/** Shift an explicit source UTF-16 code-unit offset by a supplied signed source-length change without interpreting escape sequences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceOffset, insertedSourceCodeUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sourceOffset) &&
        sourceOffset >= 0 &&
        sourceOffset <= Number.MAX_SAFE_INTEGER,
      "sourceOffset",
    ),
      sourceOffset);
    (H.domain(
      Number.isSafeInteger(insertedSourceCodeUnits) &&
        insertedSourceCodeUnits >= -Number.MAX_SAFE_INTEGER &&
        insertedSourceCodeUnits <= Number.MAX_SAFE_INTEGER,
      "insertedSourceCodeUnits",
    ),
      insertedSourceCodeUnits);
    H.domain(
      BigInt(sourceOffset) + BigInt(insertedSourceCodeUnits) >= 0n,
      "insertedSourceCodeUnits",
    );
    return {
      shiftedOffset: Number(
        BigInt(sourceOffset) + BigInt(insertedSourceCodeUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceOffset: 12, insertedSourceCodeUnits: 5 },
  output: { shiftedOffset: 17 },
} satisfies ToolExample<Input, Output>;
export const unicodeEscapeSourceOffsetShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["text", "computer science"],
      keywords: ["text", "computer science"],
    },
    id: "text/unicode-escape-source-offset-shift",
    title: "Unicode Escape Source Offset Shift",
    description:
      "Shift an explicit source UTF-16 code-unit offset by a supplied signed source-length change without interpreting escape sequences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceOffset: { type: "integer", minimum: 0 },
        insertedSourceCodeUnits: { type: "integer" },
      },
      required: ["sourceOffset", "insertedSourceCodeUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shiftedOffset: { type: "integer" } },
      required: ["shiftedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "sourceOffset",
          label: "Source Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "insertedSourceCodeUnits",
          label: "Inserted Source Code Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shiftedOffset",
          label: "Shifted Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeEscapeSourceOffsetShiftTool.execute;
export default unicodeEscapeSourceOffsetShiftTool;
