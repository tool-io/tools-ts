import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type SalesTaxDirection = "add" | "extract";

export type SalesTaxInput = {
  readonly direction: SalesTaxDirection;
  readonly ratePercent: number;
  readonly value: number;
};

export type SalesTaxOutput = {
  readonly net: number;
  readonly tax: number;
  readonly gross: number;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const salesTaxInputSchema = {
  additionalProperties: false,
  properties: {
    direction: {
      description:
        "add treats value as net; extract treats value as tax-inclusive.",
      enum: ["add", "extract"],
      type: "string",
    },
    ratePercent: { description: "Tax rate in percent.", minimum: 0, type: "number" },
    value: {
      description: "Net amount (add) or gross amount (extract).",
      minimum: 0,
      type: "number",
    },
  },
  required: ["direction", "ratePercent", "value"],
  type: "object",
} as const;

export const salesTaxOutputSchema = {
  additionalProperties: false,
  properties: {
    gross: {
      description: "Tax-inclusive amount, rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    net: {
      description: "Tax-exclusive amount, rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    tax: {
      description: "Tax portion, rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["net", "tax", "gross"],
  type: "object",
} as const;

export const salesTaxExample = {
  input: { direction: "extract", ratePercent: 19, value: 119 },
  output: { gross: 119, net: 100, tax: 19 },
} satisfies ToolExample<SalesTaxInput, SalesTaxOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isSalesTaxOutput = (value: unknown): value is SalesTaxOutput =>
  isRecord(value) &&
  typeof value.net === "number" &&
  typeof value.gross === "number";

export const calculateSalesTax = (
  input: unknown,
): ToolResult<SalesTaxOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["direction", "ratePercent", "value"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const direction = input.direction as SalesTaxDirection | undefined;
  if (direction === undefined)
    return invalidInput([
      ...issues,
      {
        code: "direction_required",
        field: "direction",
        message: "direction is required.",
      },
    ]);
  if (direction !== "add" && direction !== "extract")
    return invalidInput([
      ...issues,
      {
        code: "direction_invalid",
        field: "direction",
        message: "direction must be add or extract.",
      },
    ]);
  for (const [field, value] of [
    ["ratePercent", input.ratePercent],
    ["value", input.value],
  ] as const)
    if (value === undefined)
      return invalidInput([
        ...issues,
        {
          code: `${field}_required`,
          field,
          message: `${field} is required.`,
        },
      ]);
    else if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      (value as number) < 0
    )
      return invalidInput([
        ...issues,
        {
          code: `${field}_invalid`,
          field,
          message: `${field} must be a nonnegative finite number.`,
        },
      ]);
  if (issues.length > 0) return invalidInput(issues);

  const ratePercent = input.ratePercent as number;
  const value = input.value as number;
  let net: number;
  let gross: number;
  if (direction === "add") {
    net = value;
    gross = value * (1 + ratePercent / 100);
  } else {
    gross = value;
    net = value / (1 + ratePercent / 100);
  }
  return toolSuccess({
    gross: round2(gross),
    net: round2(net),
    tax: round2(gross - net),
  });
};

export const salesTaxTool = defineTool<SalesTaxInput, SalesTaxOutput>({
  contractVersion: 1,
  description:
    "Add or extract a percentage tax between net and gross amounts in one direction-aware step.",
  discovery: {
    aliases: ["vat-calculator", "gst-calculator", "tax-adder"],
    keywords: ["gross", "net", "sales tax", "vat"],
  },
  execute: calculateSalesTax,
  execution: { kind: "pure" },
  id: "finance/sales-tax",
  inputSchema: salesTaxInputSchema,
  outputSchema: salesTaxOutputSchema,
  ports: {
    inputs: [
      {
        description: "Amount to transform.",
        id: "value",
        label: "Amount",
        required: true,
        valueType: { format: "currency-amount", type: "number" },
      },
      {
        description: "Tax rate in percent.",
        id: "ratePercent",
        label: "Rate",
        required: true,
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Whether the amount is net or tax-inclusive.",
        id: "direction",
        label: "Direction",
        required: true,
        valueType: { format: "tax-direction", type: "string" },
      },
    ],
    outputs: [
      { description: "Tax-exclusive amount.", id: "net", label: "Net", valueType: { format: "currency-amount", type: "number" } },
      { description: "Tax portion.", id: "tax", label: "Tax", valueType: { format: "currency-amount", type: "number" } },
      { description: "Tax-inclusive amount.", id: "gross", label: "Gross", valueType: { format: "currency-amount", type: "number" } },
    ],
  },
  title: "Sales Tax",
});

export const runSalesTax = salesTaxTool.execute;
export default salesTaxTool;
