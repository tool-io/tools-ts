import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly starts: readonly number[];
  readonly ends: readonly number[];
  readonly replacement: string;
};
export type Output = {
  readonly redacted: string;
  readonly removedCodeUnits: number;
  readonly resultingCodeUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    starts: { type: "array", maxItems: 256, items: { type: "integer" } },
    ends: { type: "array", maxItems: 256, items: { type: "integer" } },
    replacement: { type: "string", maxLength: 8192 },
  },
  required: ["text", "starts", "ends", "replacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redacted: { type: "string", maxLength: 8192 },
    removedCodeUnits: { type: "integer" },
    resultingCodeUnits: { type: "integer" },
  },
  required: ["redacted", "removedCodeUnits", "resultingCodeUnits"],
} as const;
/** Replace explicitly selected nonoverlapping UTF-16 spans in an authorized benign record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, starts, ends, replacement } = request;
  const compute = (): Output => {
    H.sameLength(starts, ends);
    H.domain(
      starts.every(
        (x, i) =>
          x >= 0 &&
          ends[i] >= x &&
          ends[i] <= text.length &&
          (i === 0 || x >= ends[i - 1]),
      ),
      "starts",
    );
    let cursor = 0,
      redacted = "",
      removedCodeUnits = 0;
    starts.forEach((x, i) => {
      redacted += text.slice(cursor, x) + replacement;
      removedCodeUnits += ends[i] - x;
      cursor = ends[i];
    });
    redacted += text.slice(cursor);
    return { redacted, removedCodeUnits, resultingCodeUnits: redacted.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "abcdefghi", starts: [1, 6], ends: [3, 8], replacement: "*" },
  output: { redacted: "a*def*i", removedCodeUnits: 4, resultingCodeUnits: 7 },
} satisfies ToolExample<Input, Output>;
export const biosecurityLogRedactionLengthBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-log-redaction-length-budget",
      title: "Biosecurity Log Redaction Length Budget Tool",
      description:
        "Replace explicitly selected nonoverlapping UTF-16 spans in an authorized benign record.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          starts: { type: "array", maxItems: 256, items: { type: "integer" } },
          ends: { type: "array", maxItems: 256, items: { type: "integer" } },
          replacement: { type: "string", maxLength: 8192 },
        },
        required: ["text", "starts", "ends", "replacement"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redacted: { type: "string", maxLength: 8192 },
          removedCodeUnits: { type: "integer" },
          resultingCodeUnits: { type: "integer" },
        },
        required: ["redacted", "removedCodeUnits", "resultingCodeUnits"],
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
            id: "starts",
            label: "Starts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "ends",
            label: "Ends",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "replacement",
            label: "Replacement",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "redacted", label: "Redacted", valueType: { type: "string" } },
          {
            id: "removedCodeUnits",
            label: "Removed Code Units",
            valueType: { type: "integer" },
          },
          {
            id: "resultingCodeUnits",
            label: "Resulting Code Units",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityLogRedactionLengthBudgetTool.execute;
export default biosecurityLogRedactionLengthBudgetTool;
