import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly majorUnits: number;
  readonly subunits: number;
  readonly suppliedBase: number;
  readonly divisor: number;
};
export type Output = {
  readonly totalSubunits: number;
  readonly quotient: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    majorUnits: { type: "integer", minimum: 0 },
    subunits: { type: "integer", minimum: 0 },
    suppliedBase: { type: "integer", minimum: 1 },
    divisor: { type: "integer", minimum: 1 },
  },
  required: ["majorUnits", "subunits", "suppliedBase", "divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSubunits: { type: "integer" },
    quotient: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["totalSubunits", "quotient", "remainder"],
} as const;
/** Calculate historical coin fraction remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { majorUnits, subunits, suppliedBase, divisor } = request;
  const compute = (): Output => {
    H.integer(majorUnits, 0);
    H.integer(suppliedBase, 1);
    H.integer(subunits, 0, suppliedBase - 1);
    H.integer(divisor, 1);
    H.domain(Number.isSafeInteger(majorUnits * suppliedBase + subunits));
    return {
      totalSubunits: majorUnits * suppliedBase + subunits,
      quotient: Math.floor((majorUnits * suppliedBase + subunits) / divisor),
      remainder: (majorUnits * suppliedBase + subunits) % divisor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { majorUnits: 2, subunits: 3, suppliedBase: 20, divisor: 7 },
  output: { totalSubunits: 43, quotient: 6, remainder: 1 },
} satisfies ToolExample<Input, Output>;
export const historicalCoinFractionRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/historical-coin-fraction-remainder",
    title: "Historical Coin Fraction Remainder Tool",
    description:
      "Calculate historical coin fraction remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        majorUnits: { type: "integer", minimum: 0 },
        subunits: { type: "integer", minimum: 0 },
        suppliedBase: { type: "integer", minimum: 1 },
        divisor: { type: "integer", minimum: 1 },
      },
      required: ["majorUnits", "subunits", "suppliedBase", "divisor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSubunits: { type: "integer" },
        quotient: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["totalSubunits", "quotient", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "majorUnits",
          label: "Major Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subunits",
          label: "Subunits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedBase",
          label: "Supplied Base",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalSubunits",
          label: "Total Subunits",
          valueType: { type: "integer" },
        },
        { id: "quotient", label: "Quotient", valueType: { type: "integer" } },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = historicalCoinFractionRemainderTool.execute;
export default historicalCoinFractionRemainderTool;
