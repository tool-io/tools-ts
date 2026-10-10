import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCleanPieces: number;
  readonly returnedCleanPieces: number;
  readonly issuedPieces: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCleanPieces: { type: "integer", minimum: 0 },
    returnedCleanPieces: { type: "integer", minimum: 0 },
    issuedPieces: { type: "integer", minimum: 0 },
  },
  required: ["openingCleanPieces", "returnedCleanPieces", "issuedPieces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit clean-linen stock and issue counts using exact integer arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCleanPieces, returnedCleanPieces, issuedPieces } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCleanPieces) &&
        openingCleanPieces >= 0 &&
        openingCleanPieces <= Number.MAX_SAFE_INTEGER,
      "openingCleanPieces",
    ),
      openingCleanPieces);
    (H.domain(
      Number.isSafeInteger(returnedCleanPieces) &&
        returnedCleanPieces >= 0 &&
        returnedCleanPieces <= Number.MAX_SAFE_INTEGER,
      "returnedCleanPieces",
    ),
      returnedCleanPieces);
    (H.domain(
      Number.isSafeInteger(issuedPieces) &&
        issuedPieces >= 0 &&
        issuedPieces <= Number.MAX_SAFE_INTEGER,
      "issuedPieces",
    ),
      issuedPieces);
    return {
      closingBalance: Number(
        BigInt(openingCleanPieces) +
          BigInt(returnedCleanPieces) -
          BigInt(issuedPieces),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCleanPieces: 20, returnedCleanPieces: 8, issuedPieces: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const bedLinenChangeStockReturnBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/bed-linen-change-stock-return-balance",
    title: "BED Linen Change Stock Return Balance",
    description:
      "Reconcile explicit clean-linen stock and issue counts using exact integer arithmetic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCleanPieces: { type: "integer", minimum: 0 },
        returnedCleanPieces: { type: "integer", minimum: 0 },
        issuedPieces: { type: "integer", minimum: 0 },
      },
      required: ["openingCleanPieces", "returnedCleanPieces", "issuedPieces"],
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
          id: "openingCleanPieces",
          label: "Opening Clean Pieces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedCleanPieces",
          label: "Returned Clean Pieces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issuedPieces",
          label: "Issued Pieces",
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
export const run = bedLinenChangeStockReturnBalanceTool.execute;
export default bedLinenChangeStockReturnBalanceTool;
