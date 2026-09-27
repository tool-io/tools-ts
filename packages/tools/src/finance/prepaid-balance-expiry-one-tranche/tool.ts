import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly balance: number;
  readonly expiryEpoch: number;
  readonly nowEpoch: number;
};
export type Output = { readonly available: number; readonly expired: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balance: { type: "number", minimum: 0 },
    expiryEpoch: { type: "integer" },
    nowEpoch: { type: "integer" },
  },
  required: ["balance", "expiryEpoch", "nowEpoch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "number" }, expired: { type: "number" } },
  required: ["available", "expired"],
} as const;
/** Calculate prepaid balance expiry one tranche from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { balance, expiryEpoch, nowEpoch } = request;
  const compute = (): Output => {
    H.domain(balance >= 0);
    const expired = nowEpoch >= expiryEpoch ? balance : 0;
    return { available: balance - expired, expired };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { balance: 50, expiryEpoch: 1000, nowEpoch: 1000 },
  output: { available: 0, expired: 50 },
} satisfies ToolExample<Input, Output>;
export const prepaidBalanceExpiryOneTrancheTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/prepaid-balance-expiry-one-tranche",
    title: "Prepaid Balance Expiry One Tranche Tool",
    description:
      "Calculate prepaid balance expiry one tranche from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balance: { type: "number", minimum: 0 },
        expiryEpoch: { type: "integer" },
        nowEpoch: { type: "integer" },
      },
      required: ["balance", "expiryEpoch", "nowEpoch"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "number" },
        expired: { type: "number" },
      },
      required: ["available", "expired"],
    },
    ports: {
      inputs: [
        {
          id: "balance",
          label: "Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expiryEpoch",
          label: "Expiry Epoch",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nowEpoch",
          label: "Now Epoch",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "number" } },
        { id: "expired", label: "Expired", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = prepaidBalanceExpiryOneTrancheTool.execute;
export default prepaidBalanceExpiryOneTrancheTool;
