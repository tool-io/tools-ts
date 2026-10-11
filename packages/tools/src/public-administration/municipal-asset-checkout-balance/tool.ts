import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCheckedOutAssets: number;
  readonly newCheckouts: number;
  readonly recordedReturns: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCheckedOutAssets: { type: "integer", minimum: 0 },
    newCheckouts: { type: "integer", minimum: 0 },
    recordedReturns: { type: "integer", minimum: 0 },
  },
  required: ["openingCheckedOutAssets", "newCheckouts", "recordedReturns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit municipal asset checkout counts using exact integer arithmetic without tracking individual users. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCheckedOutAssets, newCheckouts, recordedReturns } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCheckedOutAssets) &&
        openingCheckedOutAssets >= 0 &&
        openingCheckedOutAssets <= Number.MAX_SAFE_INTEGER,
      "openingCheckedOutAssets",
    ),
      openingCheckedOutAssets);
    (H.domain(
      Number.isSafeInteger(newCheckouts) &&
        newCheckouts >= 0 &&
        newCheckouts <= Number.MAX_SAFE_INTEGER,
      "newCheckouts",
    ),
      newCheckouts);
    (H.domain(
      Number.isSafeInteger(recordedReturns) &&
        recordedReturns >= 0 &&
        recordedReturns <= Number.MAX_SAFE_INTEGER,
      "recordedReturns",
    ),
      recordedReturns);
    return {
      closingBalance: Number(
        BigInt(openingCheckedOutAssets) +
          BigInt(newCheckouts) -
          BigInt(recordedReturns),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCheckedOutAssets: 20, newCheckouts: 8, recordedReturns: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const municipalAssetCheckoutBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/municipal-asset-checkout-balance",
    title: "Municipal Asset Checkout Balance",
    description:
      "Reconcile explicit municipal asset checkout counts using exact integer arithmetic without tracking individual users.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCheckedOutAssets: { type: "integer", minimum: 0 },
        newCheckouts: { type: "integer", minimum: 0 },
        recordedReturns: { type: "integer", minimum: 0 },
      },
      required: ["openingCheckedOutAssets", "newCheckouts", "recordedReturns"],
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
          id: "openingCheckedOutAssets",
          label: "Opening Checked Out Assets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newCheckouts",
          label: "New Checkouts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedReturns",
          label: "Recorded Returns",
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
export const run = municipalAssetCheckoutBalanceTool.execute;
export default municipalAssetCheckoutBalanceTool;
