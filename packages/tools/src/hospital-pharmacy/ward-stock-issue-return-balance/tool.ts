import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingStock: number;
  readonly issuedToWard: number;
  readonly returnedFromWard: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingStock: { type: "integer", minimum: 0 },
    issuedToWard: { type: "integer", minimum: 0 },
    returnedFromWard: { type: "integer", minimum: 0 },
  },
  required: ["openingStock", "issuedToWard", "returnedFromWard"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit ward-stock issue and return counts using exact integer arithmetic, preserving a signed discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingStock, issuedToWard, returnedFromWard } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingStock) &&
        openingStock >= 0 &&
        openingStock <= Number.MAX_SAFE_INTEGER,
      "openingStock",
    ),
      openingStock);
    (H.domain(
      Number.isSafeInteger(issuedToWard) &&
        issuedToWard >= 0 &&
        issuedToWard <= Number.MAX_SAFE_INTEGER,
      "issuedToWard",
    ),
      issuedToWard);
    (H.domain(
      Number.isSafeInteger(returnedFromWard) &&
        returnedFromWard >= 0 &&
        returnedFromWard <= Number.MAX_SAFE_INTEGER,
      "returnedFromWard",
    ),
      returnedFromWard);
    return {
      closingBalance: Number(
        BigInt(openingStock) + BigInt(issuedToWard) - BigInt(returnedFromWard),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingStock: 20, issuedToWard: 8, returnedFromWard: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const wardStockIssueReturnBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/ward-stock-issue-return-balance",
    title: "Ward Stock Issue Return Balance",
    description:
      "Reconcile explicit ward-stock issue and return counts using exact integer arithmetic, preserving a signed discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingStock: { type: "integer", minimum: 0 },
        issuedToWard: { type: "integer", minimum: 0 },
        returnedFromWard: { type: "integer", minimum: 0 },
      },
      required: ["openingStock", "issuedToWard", "returnedFromWard"],
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
          id: "openingStock",
          label: "Opening Stock",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issuedToWard",
          label: "Issued To Ward",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedFromWard",
          label: "Returned From Ward",
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
export const run = wardStockIssueReturnBalanceTool.execute;
export default wardStockIssueReturnBalanceTool;
