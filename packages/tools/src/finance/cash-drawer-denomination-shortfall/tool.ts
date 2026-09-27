import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly denominations: readonly number[];
  readonly expected: readonly number[];
  readonly actual: readonly number[];
};
export type Output = {
  readonly shortfall: number;
  readonly differences: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominations: { type: "array", maxItems: 256, items: { type: "number" } },
    expected: { type: "array", maxItems: 256, items: { type: "integer" } },
    actual: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["denominations", "expected", "actual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "number" },
    differences: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["shortfall", "differences"],
} as const;
/** Calculate cash drawer denomination shortfall from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { denominations, expected, actual } = request;
  const compute = (): Output => {
    H.sameLength(denominations, expected);
    H.sameLength(expected, actual);
    H.domain(
      denominations.every((x) => x > 0) &&
        expected.every((x) => x >= 0) &&
        actual.every((x) => x >= 0),
    );
    const differences = expected.map((x, i) => x - actual[i]);
    return { shortfall: H.dot(denominations, differences), differences };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { denominations: [5, 10], expected: [3, 2], actual: [2, 1] },
  output: { shortfall: 15, differences: [1, 1] },
} satisfies ToolExample<Input, Output>;
export const cashDrawerDenominationShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/cash-drawer-denomination-shortfall",
    title: "Cash Drawer Denomination Shortfall Tool",
    description:
      "Calculate cash drawer denomination shortfall from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        expected: { type: "array", maxItems: 256, items: { type: "integer" } },
        actual: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["denominations", "expected", "actual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        differences: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["shortfall", "differences"],
    },
    ports: {
      inputs: [
        {
          id: "denominations",
          label: "Denominations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        {
          id: "differences",
          label: "Differences",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = cashDrawerDenominationShortfallTool.execute;
export default cashDrawerDenominationShortfallTool;
