import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEarliest: string;
  readonly firstLatest: string;
  readonly secondEarliest: string;
  readonly secondLatest: string;
};
export type Output = {
  readonly overlap: boolean;
  readonly firstDefinitelyBefore: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEarliest: { type: "string", maxLength: 8192 },
    firstLatest: { type: "string", maxLength: 8192 },
    secondEarliest: { type: "string", maxLength: 8192 },
    secondLatest: { type: "string", maxLength: 8192 },
  },
  required: ["firstEarliest", "firstLatest", "secondEarliest", "secondLatest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "boolean" },
    firstDefinitelyBefore: { type: "boolean" },
  },
  required: ["overlap", "firstDefinitelyBefore"],
} as const;
/** Calculate date comparison partial precision overlap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstEarliest, firstLatest, secondEarliest, secondLatest } = input;
  const compute = (): Output => {
    const a = H.dateOnly(firstEarliest).getTime(),
      b = H.dateOnly(firstLatest).getTime(),
      c = H.dateOnly(secondEarliest).getTime(),
      d = H.dateOnly(secondLatest).getTime();
    H.domain(a <= b && c <= d);
    return {
      overlap: Math.max(a, c) <= Math.min(b, d),
      firstDefinitelyBefore: b < c,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    firstEarliest: "2026-01-01",
    firstLatest: "2026-01-31",
    secondEarliest: "2026-01-15",
    secondLatest: "2026-02-01",
  },
  output: { overlap: true, firstDefinitelyBefore: false },
} satisfies ToolExample<Input, Output>;
export const dateComparisonPartialPrecisionOverlapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "date/date-comparison-partial-precision-overlap",
      title: "Date Comparison Partial Precision Overlap Tool",
      description:
        "Calculate date comparison partial precision overlap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstEarliest: { type: "string", maxLength: 8192 },
          firstLatest: { type: "string", maxLength: 8192 },
          secondEarliest: { type: "string", maxLength: 8192 },
          secondLatest: { type: "string", maxLength: 8192 },
        },
        required: [
          "firstEarliest",
          "firstLatest",
          "secondEarliest",
          "secondLatest",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          overlap: { type: "boolean" },
          firstDefinitelyBefore: { type: "boolean" },
        },
        required: ["overlap", "firstDefinitelyBefore"],
      },
      ports: {
        inputs: [
          {
            id: "firstEarliest",
            label: "First Earliest",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstLatest",
            label: "First Latest",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondEarliest",
            label: "Second Earliest",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondLatest",
            label: "Second Latest",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
          {
            id: "firstDefinitelyBefore",
            label: "First Definitely Before",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dateComparisonPartialPrecisionOverlapTool.execute;
export default dateComparisonPartialPrecisionOverlapTool;
