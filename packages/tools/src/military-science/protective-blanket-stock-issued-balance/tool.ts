import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingBlankets: number;
  readonly receivedBlankets: number;
  readonly issuedBlankets: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingBlankets: { type: "integer", minimum: 0 },
    receivedBlankets: { type: "integer", minimum: 0 },
    issuedBlankets: { type: "integer", minimum: 0 },
  },
  required: ["openingBlankets", "receivedBlankets", "issuedBlankets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit relief blanket stock counts using exact integer arithmetic without allocating aid priorities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingBlankets, receivedBlankets, issuedBlankets } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingBlankets) &&
        openingBlankets >= 0 &&
        openingBlankets <= Number.MAX_SAFE_INTEGER,
      "openingBlankets",
    ),
      openingBlankets);
    (H.domain(
      Number.isSafeInteger(receivedBlankets) &&
        receivedBlankets >= 0 &&
        receivedBlankets <= Number.MAX_SAFE_INTEGER,
      "receivedBlankets",
    ),
      receivedBlankets);
    (H.domain(
      Number.isSafeInteger(issuedBlankets) &&
        issuedBlankets >= 0 &&
        issuedBlankets <= Number.MAX_SAFE_INTEGER,
      "issuedBlankets",
    ),
      issuedBlankets);
    return {
      closingBalance: Number(
        BigInt(openingBlankets) +
          BigInt(receivedBlankets) -
          BigInt(issuedBlankets),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingBlankets: 20, receivedBlankets: 8, issuedBlankets: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const protectiveBlanketStockIssuedBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["military-science", "military science", "social sciences"],
        keywords: ["military science", "social sciences"],
      },
      id: "military-science/protective-blanket-stock-issued-balance",
      title: "Protective Blanket Stock Issued Balance",
      description:
        "Reconcile explicit relief blanket stock counts using exact integer arithmetic without allocating aid priorities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingBlankets: { type: "integer", minimum: 0 },
          receivedBlankets: { type: "integer", minimum: 0 },
          issuedBlankets: { type: "integer", minimum: 0 },
        },
        required: ["openingBlankets", "receivedBlankets", "issuedBlankets"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { closingBalance: { type: "integer" } },
        required: ["closingBalance"],
      },
      ports: {
        inputs: [
          {
            id: "openingBlankets",
            label: "Opening Blankets",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "receivedBlankets",
            label: "Received Blankets",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "issuedBlankets",
            label: "Issued Blankets",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "closingBalance",
            label: "Closing Balance",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = protectiveBlanketStockIssuedBalanceTool.execute;
export default protectiveBlanketStockIssuedBalanceTool;
