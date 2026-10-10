import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCount: number;
  readonly issuedCount: number;
  readonly returnedCount: number;
  readonly writtenOffCount: number;
};
export type Output = { readonly outstandingCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCount: { type: "integer", minimum: 0 },
    issuedCount: { type: "integer", minimum: 0 },
    returnedCount: { type: "integer", minimum: 0 },
    writtenOffCount: { type: "integer", minimum: 0 },
  },
  required: ["openingCount", "issuedCount", "returnedCount", "writtenOffCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outstandingCount: { type: "integer" } },
  required: ["outstandingCount"],
} as const;
/** Reconcile explicit assistive-device loan movements with exact integer arithmetic and a signed closing discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCount, issuedCount, returnedCount, writtenOffCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCount) &&
        openingCount >= 0 &&
        openingCount <= Number.MAX_SAFE_INTEGER,
      "openingCount",
    ),
      openingCount);
    (H.domain(
      Number.isSafeInteger(issuedCount) &&
        issuedCount >= 0 &&
        issuedCount <= Number.MAX_SAFE_INTEGER,
      "issuedCount",
    ),
      issuedCount);
    (H.domain(
      Number.isSafeInteger(returnedCount) &&
        returnedCount >= 0 &&
        returnedCount <= Number.MAX_SAFE_INTEGER,
      "returnedCount",
    ),
      returnedCount);
    (H.domain(
      Number.isSafeInteger(writtenOffCount) &&
        writtenOffCount >= 0 &&
        writtenOffCount <= Number.MAX_SAFE_INTEGER,
      "writtenOffCount",
    ),
      writtenOffCount);
    return {
      outstandingCount: Number(
        BigInt(openingCount) +
          BigInt(issuedCount) -
          BigInt(returnedCount) -
          BigInt(writtenOffCount),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingCount: 10,
    issuedCount: 4,
    returnedCount: 3,
    writtenOffCount: 1,
  },
  output: { outstandingCount: 10 },
} satisfies ToolExample<Input, Output>;
export const assistiveDeviceLoanBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/assistive-device-loan-balance",
    title: "Assistive Device Loan Balance",
    description:
      "Reconcile explicit assistive-device loan movements with exact integer arithmetic and a signed closing discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCount: { type: "integer", minimum: 0 },
        issuedCount: { type: "integer", minimum: 0 },
        returnedCount: { type: "integer", minimum: 0 },
        writtenOffCount: { type: "integer", minimum: 0 },
      },
      required: [
        "openingCount",
        "issuedCount",
        "returnedCount",
        "writtenOffCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outstandingCount: { type: "integer" } },
      required: ["outstandingCount"],
    },
    ports: {
      inputs: [
        {
          id: "openingCount",
          label: "Opening Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issuedCount",
          label: "Issued Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedCount",
          label: "Returned Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "writtenOffCount",
          label: "Written Off Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outstandingCount",
          label: "Outstanding Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = assistiveDeviceLoanBalanceTool.execute;
export default assistiveDeviceLoanBalanceTool;
