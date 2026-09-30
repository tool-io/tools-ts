import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly audience: number;
  readonly firstFraction: number;
};
export type Output = {
  readonly first: number;
  readonly second: number;
  readonly roundingError: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audience: { type: "integer", minimum: 0 },
    firstFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["audience", "firstFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer" },
    second: { type: "integer" },
    roundingError: { type: "number" },
  },
  required: ["first", "second", "roundingError"],
} as const;
/** Floor the first cell allocation and give the exact remainder to the second. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { audience, firstFraction } = request;
  const compute = (): Output => {
    H.integer(audience, 0);
    H.probability(firstFraction);
    return {
      first: Math.floor(audience * firstFraction),
      second: audience - Math.floor(audience * firstFraction),
      roundingError:
        Math.floor(audience * firstFraction) - audience * firstFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { audience: 101, firstFraction: 0.5 },
  output: { first: 50, second: 51, roundingError: -0.5 },
} satisfies ToolExample<Input, Output>;
export const campaignTestCellAllocationRoundingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/campaign-test-cell-allocation-rounding",
    title: "Campaign Test Cell Allocation Rounding Tool",
    description:
      "Floor the first cell allocation and give the exact remainder to the second.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        audience: { type: "integer", minimum: 0 },
        firstFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["audience", "firstFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer" },
        second: { type: "integer" },
        roundingError: { type: "number" },
      },
      required: ["first", "second", "roundingError"],
    },
    ports: {
      inputs: [
        {
          id: "audience",
          label: "Audience",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstFraction",
          label: "First Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "first", label: "First", valueType: { type: "integer" } },
        { id: "second", label: "Second", valueType: { type: "integer" } },
        {
          id: "roundingError",
          label: "Rounding Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignTestCellAllocationRoundingTool.execute;
export default campaignTestCellAllocationRoundingTool;
