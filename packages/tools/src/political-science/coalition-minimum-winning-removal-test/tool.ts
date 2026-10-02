import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seats: readonly number[];
  readonly threshold: number;
};
export type Output = {
  readonly total: number;
  readonly winning: boolean;
  readonly minimal: boolean;
  readonly removalTotals: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seats: { type: "array", maxItems: 256, items: { type: "integer" } },
    threshold: { type: "integer", minimum: 1 },
  },
  required: ["seats", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "integer" },
    winning: { type: "boolean" },
    minimal: { type: "boolean" },
    removalTotals: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["total", "winning", "minimal", "removalTotals"],
} as const;
/** A minimum winning coalition here means inclusion-minimal: removing any included party loses the supplied majority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seats, threshold } = request;
  const compute = (): Output => {
    H.domain(seats.every((x) => x >= 0));
    H.integer(threshold, 1);
    const total = seats.reduce((a, b) => a + b, 0),
      removalTotals = seats.map((x) => total - x),
      winning = total >= threshold;
    return {
      total,
      winning,
      minimal: winning && removalTotals.every((x) => x < threshold),
      removalTotals,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seats: [30, 25], threshold: 51 },
  output: { total: 55, winning: true, minimal: true, removalTotals: [25, 30] },
} satisfies ToolExample<Input, Output>;
export const coalitionMinimumWinningRemovalTestTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/coalition-minimum-winning-removal-test",
    title: "Coalition Minimum Winning Removal Test Tool",
    description:
      "A minimum winning coalition here means inclusion-minimal: removing any included party loses the supplied majority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seats: { type: "array", maxItems: 256, items: { type: "integer" } },
        threshold: { type: "integer", minimum: 1 },
      },
      required: ["seats", "threshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "integer" },
        winning: { type: "boolean" },
        minimal: { type: "boolean" },
        removalTotals: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["total", "winning", "minimal", "removalTotals"],
    },
    ports: {
      inputs: [
        {
          id: "seats",
          label: "Seats",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "total", label: "Total", valueType: { type: "integer" } },
        { id: "winning", label: "Winning", valueType: { type: "boolean" } },
        { id: "minimal", label: "Minimal", valueType: { type: "boolean" } },
        {
          id: "removalTotals",
          label: "Removal Totals",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = coalitionMinimumWinningRemovalTestTool.execute;
export default coalitionMinimumWinningRemovalTestTool;
