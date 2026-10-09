import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotedPrice: number;
  readonly contractMultiplier: number;
  readonly contractCount: number;
};
export type Output = { readonly signedNotional: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedPrice: { type: "number" },
    contractMultiplier: { type: "number", exclusiveMinimum: 0 },
    contractCount: { type: "integer" },
  },
  required: ["quotedPrice", "contractMultiplier", "contractCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedNotional: { type: "number" } },
  required: ["signedNotional"],
} as const;
/** Multiply an explicit quoted price, positive exchange contract multiplier and signed position count without selecting contract specifications. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotedPrice, contractMultiplier, contractCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(contractMultiplier) && contractMultiplier > 0,
      "contractMultiplier",
    ),
      contractMultiplier);
    (H.domain(
      Number.isSafeInteger(contractCount) &&
        contractCount >= -Number.MAX_SAFE_INTEGER &&
        contractCount <= Number.MAX_SAFE_INTEGER,
      "contractCount",
    ),
      contractCount);
    return { signedNotional: quotedPrice * contractMultiplier * contractCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotedPrice: 25, contractMultiplier: 100, contractCount: 3 },
  output: { signedNotional: 7500 },
} satisfies ToolExample<Input, Output>;
export const exchangeQuotedContractMultiplierTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "financial-economics/exchange-quoted-contract-multiplier-term",
      title: "Exchange Quoted Contract Multiplier Term Tool",
      description:
        "Multiply an explicit quoted price, positive exchange contract multiplier and signed position count without selecting contract specifications.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          quotedPrice: { type: "number" },
          contractMultiplier: { type: "number", exclusiveMinimum: 0 },
          contractCount: { type: "integer" },
        },
        required: ["quotedPrice", "contractMultiplier", "contractCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedNotional: { type: "number" } },
        required: ["signedNotional"],
      },
      ports: {
        inputs: [
          {
            id: "quotedPrice",
            label: "Quoted Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contractMultiplier",
            label: "Contract Multiplier",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contractCount",
            label: "Contract Count",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "signedNotional",
            label: "Signed Notional",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = exchangeQuotedContractMultiplierTermTool.execute;
export default exchangeQuotedContractMultiplierTermTool;
