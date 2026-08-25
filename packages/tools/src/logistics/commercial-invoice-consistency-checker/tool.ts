import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CommercialInvoiceConsistencyCheckerInput = {
  readonly customsDeclaredValue: number;
  readonly grossWeightKg: number;
  readonly invoiceQuantity: number;
  readonly invoiceValue: number;
  readonly netWeightKg: number;
  readonly shippedQuantity: number;
  readonly valueTolerancePercent?: number;
};

export type CommercialInvoiceConsistencyCheckerOutput = {
  readonly fullyConsistent: boolean;
  readonly issues: readonly string[];
  readonly quantityConsistent: boolean;
  readonly valueConsistent: boolean;
  readonly weightConsistent: boolean;
};

export const calculateCommercialInvoiceConsistencyChecker = (
  input: CommercialInvoiceConsistencyCheckerInput,
): CommercialInvoiceConsistencyCheckerOutput => {
  for (const key of [
    "customsDeclaredValue",
    "grossWeightKg",
    "invoiceValue",
    "netWeightKg",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0)
      return simpleError(
        key,
        "Values and weights must be finite and non-negative.",
        "invalid_value",
      );
  }
  for (const key of ["invoiceQuantity", "shippedQuantity"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Quantities must be non-negative whole numbers.",
        "invalid_quantity",
      );
  }
  if (input.invoiceValue <= 0)
    return simpleError(
      "invoiceValue",
      "Invoice value must be greater than zero.",
      "invalid_value",
    );
  const valueTolerancePercent = input.valueTolerancePercent ?? 0;
  if (
    !Number.isFinite(valueTolerancePercent) ||
    valueTolerancePercent < 0 ||
    valueTolerancePercent > 100
  )
    return simpleError(
      "valueTolerancePercent",
      "Value tolerance must be between zero and one hundred percent.",
      "invalid_percent",
    );
  const valueDeltaPercent =
    (Math.abs(input.invoiceValue - input.customsDeclaredValue) /
      input.invoiceValue) *
    100;
  if (!Number.isFinite(valueDeltaPercent))
    return simpleError(
      "customsDeclaredValue",
      "The value difference is outside the representable range.",
      "difference_out_of_range",
    );
  const issues: string[] = [];
  const valueConsistent = valueDeltaPercent <= valueTolerancePercent;
  if (!valueConsistent)
    issues.push(
      `Declared value differs from invoice value by ${valueDeltaPercent}% which exceeds tolerance ${valueTolerancePercent}%.`,
    );
  const quantityConsistent = input.invoiceQuantity === input.shippedQuantity;
  if (!quantityConsistent)
    issues.push(
      `Invoice quantity ${input.invoiceQuantity} differs from shipped quantity ${input.shippedQuantity}.`,
    );
  const weightConsistent = input.netWeightKg <= input.grossWeightKg;
  if (!weightConsistent)
    issues.push(
      `Net weight ${input.netWeightKg} kg exceeds gross weight ${input.grossWeightKg} kg.`,
    );
  return {
    fullyConsistent: issues.length === 0,
    issues,
    quantityConsistent,
    valueConsistent,
    weightConsistent,
  };
};

export const commercialInvoiceConsistencyCheckerExample = {
  input: {
    customsDeclaredValue: 5200,
    grossWeightKg: 310,
    invoiceQuantity: 240,
    invoiceValue: 5200,
    netWeightKg: 288,
    shippedQuantity: 240,
  },
  output: {
    fullyConsistent: true,
    issues: [],
    quantityConsistent: true,
    valueConsistent: true,
    weightConsistent: true,
  },
} satisfies ToolExample<
  CommercialInvoiceConsistencyCheckerInput,
  CommercialInvoiceConsistencyCheckerOutput
>;

export const commercialInvoiceConsistencyCheckerTool = createSimpleTool({
  id: "logistics/commercial-invoice-consistency-checker",
  title: "Commercial Invoice Consistency Checker",
  description:
    "Cross-check customs declared value against invoice value within a percent tolerance, shipped against invoiced quantities, and net against gross weights before lodging an entry.",
  inputs: [
    {
      description: "Value declared to customs in currency units.",
      id: "customsDeclaredValue",
      kind: "number",
      label: "Declared value",
      minimum: 0,
    },
    {
      description: "Gross weight in kilograms.",
      id: "grossWeightKg",
      kind: "number",
      label: "Gross weight",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Units shown on the commercial invoice.",
      id: "invoiceQuantity",
      kind: "integer",
      label: "Invoice quantity",
      minimum: 0,
    },
    {
      description: "Commercial invoice total in currency units.",
      id: "invoiceValue",
      kind: "number",
      label: "Invoice value",
      minimum: 0,
    },
    {
      description: "Net weight in kilograms.",
      id: "netWeightKg",
      kind: "number",
      label: "Net weight",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Units actually shipped per the packing list.",
      id: "shippedQuantity",
      kind: "integer",
      label: "Shipped quantity",
      minimum: 0,
    },
    {
      default: 0,
      description: "Allowed value difference in percent of invoice value.",
      id: "valueTolerancePercent",
      kind: "number",
      label: "Value tolerance",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "True when no consistency issue was flagged.",
      id: "fullyConsistent",
      kind: "boolean",
      label: "Fully consistent",
    },
    {
      description: "Plain-language list of detected inconsistencies.",
      id: "issues",
      kind: "stringList",
      label: "Issues",
    },
    {
      description: "True when invoiced and shipped quantities match.",
      id: "quantityConsistent",
      kind: "boolean",
      label: "Quantities match",
    },
    {
      description:
        "True when declared value is within tolerance of invoice value.",
      id: "valueConsistent",
      kind: "boolean",
      label: "Values match",
    },
    {
      description: "True when net weight does not exceed gross weight.",
      id: "weightConsistent",
      kind: "boolean",
      label: "Weights plausible",
    },
  ],
  calculate: (input) =>
    calculateCommercialInvoiceConsistencyChecker({
      customsDeclaredValue: input.customsDeclaredValue as number,
      grossWeightKg: input.grossWeightKg as number,
      invoiceQuantity: input.invoiceQuantity as number,
      invoiceValue: input.invoiceValue as number,
      netWeightKg: input.netWeightKg as number,
      shippedQuantity: input.shippedQuantity as number,
      valueTolerancePercent: input.valueTolerancePercent as number | undefined,
    }),
});

export const runCommercialInvoiceConsistencyChecker =
  commercialInvoiceConsistencyCheckerTool.execute;
export default commercialInvoiceConsistencyCheckerTool;
