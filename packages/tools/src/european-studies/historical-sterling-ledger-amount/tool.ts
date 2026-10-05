import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly poundsDecimal: string;
  readonly shillings: number;
  readonly pence: number;
  readonly negative: boolean;
};
export type Output = {
  readonly totalPenceDecimal: string;
  readonly decimalPounds: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poundsDecimal: { type: "string", maxLength: 15, format: "integer-decimal" },
    shillings: { type: "integer", minimum: 0, maximum: 19 },
    pence: { type: "integer", minimum: 0, maximum: 11 },
    negative: { type: "boolean" },
  },
  required: ["poundsDecimal", "shillings", "pence", "negative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPenceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    decimalPounds: { type: "string", maxLength: 8192 },
  },
  required: ["totalPenceDecimal", "decimalPounds"],
} as const;
/** Normalize a pre-decimal sterling pounds/shillings/pence ledger entry with 20 shillings per pound and 12 pence per shilling. Exact total pence are returned alongside an approximate decimal-pound display. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { poundsDecimal, shillings, pence, negative } = request;
  const compute = (): Output => {
    const p = H.decimal(poundsDecimal);
    H.domain(p >= 0n, "");
    (H.domain(
      Number.isSafeInteger(shillings) && shillings >= 0 && shillings <= 19,
      "shillings",
    ),
      shillings);
    (H.domain(
      Number.isSafeInteger(pence) && pence >= 0 && pence <= 11,
      "pence",
    ),
      pence);
    let total = p * 240n + BigInt(shillings * 12 + pence);
    if (negative) total = -total;
    return {
      totalPenceDecimal: total.toString(),
      decimalPounds: (Number(total) / 240).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { poundsDecimal: "2", shillings: 10, pence: 6, negative: false },
  output: { totalPenceDecimal: "606", decimalPounds: "2.525" },
} satisfies ToolExample<Input, Output>;
export const historicalSterlingLedgerAmountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/historical-sterling-ledger-amount",
    title: "Historical Sterling Ledger Amount Tool",
    description:
      "Normalize a pre-decimal sterling pounds/shillings/pence ledger entry with 20 shillings per pound and 12 pence per shilling. Exact total pence are returned alongside an approximate decimal-pound display.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poundsDecimal: {
          type: "string",
          maxLength: 15,
          format: "integer-decimal",
        },
        shillings: { type: "integer", minimum: 0, maximum: 19 },
        pence: { type: "integer", minimum: 0, maximum: 11 },
        negative: { type: "boolean" },
      },
      required: ["poundsDecimal", "shillings", "pence", "negative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPenceDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        decimalPounds: { type: "string", maxLength: 8192 },
      },
      required: ["totalPenceDecimal", "decimalPounds"],
    },
    ports: {
      inputs: [
        {
          id: "poundsDecimal",
          label: "Pounds Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "shillings",
          label: "Shillings",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pence",
          label: "Pence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "negative",
          label: "Negative",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "totalPenceDecimal",
          label: "Total Pence Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "decimalPounds",
          label: "Decimal Pounds",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalSterlingLedgerAmountTool.execute;
export default historicalSterlingLedgerAmountTool;
