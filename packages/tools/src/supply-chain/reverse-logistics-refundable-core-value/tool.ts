import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnedCoreCount: number;
  readonly acceptedCoreCount: number;
  readonly suppliedRefundPerCore: number;
};
export type Output = {
  readonly refundableAmount: number;
  readonly unacceptedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedCoreCount: { type: "integer", minimum: 0 },
    acceptedCoreCount: { type: "integer", minimum: 0 },
    suppliedRefundPerCore: { type: "number", minimum: 0 },
  },
  required: ["returnedCoreCount", "acceptedCoreCount", "suppliedRefundPerCore"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    refundableAmount: { type: "number" },
    unacceptedCount: { type: "integer" },
  },
  required: ["refundableAmount", "unacceptedCount"],
} as const;
/** Apply a supplied per-core refund to explicitly accepted returned cores without deciding acceptance criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnedCoreCount, acceptedCoreCount, suppliedRefundPerCore } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(returnedCoreCount) &&
        returnedCoreCount >= 0 &&
        returnedCoreCount <= Number.MAX_SAFE_INTEGER,
      "returnedCoreCount",
    ),
      returnedCoreCount);
    (H.domain(
      Number.isSafeInteger(acceptedCoreCount) &&
        acceptedCoreCount >= 0 &&
        acceptedCoreCount <= returnedCoreCount,
      "acceptedCoreCount",
    ),
      acceptedCoreCount);
    H.domain(suppliedRefundPerCore >= 0, "suppliedRefundPerCore");
    return {
      refundableAmount: acceptedCoreCount * suppliedRefundPerCore,
      unacceptedCount: returnedCoreCount - acceptedCoreCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnedCoreCount: 10,
    acceptedCoreCount: 8,
    suppliedRefundPerCore: 12,
  },
  output: { refundableAmount: 96, unacceptedCount: 2 },
} satisfies ToolExample<Input, Output>;
export const reverseLogisticsRefundableCoreValueTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["supply-chain", "supply chain", "business and finance"],
        keywords: ["supply chain", "business and finance"],
      },
      id: "supply-chain/reverse-logistics-refundable-core-value",
      title: "Reverse Logistics Refundable Core Value",
      description:
        "Apply a supplied per-core refund to explicitly accepted returned cores without deciding acceptance criteria.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          returnedCoreCount: { type: "integer", minimum: 0 },
          acceptedCoreCount: { type: "integer", minimum: 0 },
          suppliedRefundPerCore: { type: "number", minimum: 0 },
        },
        required: [
          "returnedCoreCount",
          "acceptedCoreCount",
          "suppliedRefundPerCore",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          refundableAmount: { type: "number" },
          unacceptedCount: { type: "integer" },
        },
        required: ["refundableAmount", "unacceptedCount"],
      },
      ports: {
        inputs: [
          {
            id: "returnedCoreCount",
            label: "Returned Core Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "acceptedCoreCount",
            label: "Accepted Core Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedRefundPerCore",
            label: "Supplied Refund Per Core",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "refundableAmount",
            label: "Refundable Amount",
            valueType: { type: "number" },
          },
          {
            id: "unacceptedCount",
            label: "Unaccepted Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reverseLogisticsRefundableCoreValueTool.execute;
export default reverseLogisticsRefundableCoreValueTool;
