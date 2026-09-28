import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valid: readonly boolean[];
  readonly expected: readonly boolean[];
};
export type Output = {
  readonly validExpected: number;
  readonly expectedCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    expected: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["valid", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validExpected: { type: "integer" },
    expectedCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validExpected", "expectedCount", "share", "defined"],
} as const;
/** Calculate country series valid period share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valid, expected } = request;
  const compute = (): Output => {
    H.sameLength(valid, expected);
    return {
      validExpected: valid.filter((x, i) => x && expected[i]).length,
      expectedCount: expected.filter(Boolean).length,
      share: expected.some(Boolean)
        ? valid.filter((x, i) => x && expected[i]).length /
          expected.filter(Boolean).length
        : 0,
      defined: expected.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { valid: [true, false, true], expected: [true, true, false] },
  output: { validExpected: 1, expectedCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const countrySeriesValidPeriodShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/country-series-valid-period-share",
    title: "Country Series Valid Period Share Tool",
    description:
      "Calculate country series valid period share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
        expected: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["valid", "expected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validExpected: { type: "integer" },
        expectedCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["validExpected", "expectedCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "valid",
          label: "Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validExpected",
          label: "Valid Expected",
          valueType: { type: "integer" },
        },
        {
          id: "expectedCount",
          label: "Expected Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = countrySeriesValidPeriodShareTool.execute;
export default countrySeriesValidPeriodShareTool;
