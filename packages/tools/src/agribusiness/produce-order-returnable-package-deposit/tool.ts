import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageCount: number;
  readonly depositPerPackage: number;
  readonly returnedPackageCount: number;
};
export type Output = {
  readonly chargedDeposit: number;
  readonly returnedDeposit: number;
  readonly outstandingDeposit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageCount: { type: "integer", minimum: 0 },
    depositPerPackage: { type: "number", minimum: 0 },
    returnedPackageCount: { type: "integer", minimum: 0 },
  },
  required: ["packageCount", "depositPerPackage", "returnedPackageCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargedDeposit: { type: "number" },
    returnedDeposit: { type: "number" },
    outstandingDeposit: { type: "number" },
  },
  required: ["chargedDeposit", "returnedDeposit", "outstandingDeposit"],
} as const;
/** Compute explicit charged, returned and outstanding package deposits without inferring refund eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageCount, depositPerPackage, returnedPackageCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(packageCount) &&
        packageCount >= 0 &&
        packageCount <= Number.MAX_SAFE_INTEGER,
      "packageCount",
    ),
      packageCount);
    (H.domain(
      Number.isSafeInteger(returnedPackageCount) &&
        returnedPackageCount >= 0 &&
        returnedPackageCount <= packageCount,
      "returnedPackageCount",
    ),
      returnedPackageCount);
    H.domain(depositPerPackage >= 0, "depositPerPackage");
    return {
      chargedDeposit: packageCount * depositPerPackage,
      returnedDeposit: returnedPackageCount * depositPerPackage,
      outstandingDeposit:
        (packageCount - returnedPackageCount) * depositPerPackage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packageCount: 12, depositPerPackage: 3, returnedPackageCount: 8 },
  output: { chargedDeposit: 36, returnedDeposit: 24, outstandingDeposit: 12 },
} satisfies ToolExample<Input, Output>;
export const produceOrderReturnablePackageDepositTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["agribusiness", "agriculture"],
        keywords: ["agribusiness", "agriculture"],
      },
      id: "agribusiness/produce-order-returnable-package-deposit",
      title: "Produce Order Returnable Package Deposit",
      description:
        "Compute explicit charged, returned and outstanding package deposits without inferring refund eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          packageCount: { type: "integer", minimum: 0 },
          depositPerPackage: { type: "number", minimum: 0 },
          returnedPackageCount: { type: "integer", minimum: 0 },
        },
        required: ["packageCount", "depositPerPackage", "returnedPackageCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          chargedDeposit: { type: "number" },
          returnedDeposit: { type: "number" },
          outstandingDeposit: { type: "number" },
        },
        required: ["chargedDeposit", "returnedDeposit", "outstandingDeposit"],
      },
      ports: {
        inputs: [
          {
            id: "packageCount",
            label: "Package Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "depositPerPackage",
            label: "Deposit Per Package",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "returnedPackageCount",
            label: "Returned Package Count",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "chargedDeposit",
            label: "Charged Deposit",
            valueType: { type: "number" },
          },
          {
            id: "returnedDeposit",
            label: "Returned Deposit",
            valueType: { type: "number" },
          },
          {
            id: "outstandingDeposit",
            label: "Outstanding Deposit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = produceOrderReturnablePackageDepositTool.execute;
export default produceOrderReturnablePackageDepositTool;
