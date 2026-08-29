import { parsePlainDate } from "../../core/date.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type SameDayDuplicateInvoice = {
  readonly amount: number;
  readonly date: string;
  readonly vendor: string;
};

export type SameDayDuplicateInvoiceInput = {
  readonly invoices: ReadonlyArray<SameDayDuplicateInvoice>;
};

export type SameDayDuplicateInvoiceOutput = {
  readonly duplicateGroups: number;
  readonly duplicateIndices: ReadonlyArray<ReadonlyArray<number>>;
  readonly duplicates: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeVendor = (vendor: string): string => vendor.trim().toLowerCase();

const matchKey = (invoice: SameDayDuplicateInvoice): string =>
  JSON.stringify([
    normalizeVendor(invoice.vendor),
    invoice.amount === 0 ? 0 : invoice.amount,
    invoice.date,
  ]);

const validateInvoiceDate = (value: string, field: string): void => {
  try {
    parsePlainDate(value, field);
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(field, error.message, "invalid_invoice_date");
    throw error;
  }
};

export const findSameDayDuplicateInvoices = (
  input: SameDayDuplicateInvoiceInput,
): SameDayDuplicateInvoiceOutput => {
  if (!Array.isArray(input.invoices))
    simpleError("invoices", "Invoices must be an array.", "invoices_required");
  if (input.invoices.length > toolResourceLimits.generatedValues)
    simpleError(
      "invoices",
      `Invoices must not contain more than ${toolResourceLimits.generatedValues} entries.`,
      "resource_limit_exceeded",
    );
  for (const [index, invoice] of input.invoices.entries()) {
    if (typeof invoice?.amount !== "number" || !Number.isFinite(invoice.amount))
      simpleError(
        `invoices.${index}.amount`,
        "Every invoice must have a finite amount.",
        "invalid_invoice_amount",
      );
    if (typeof invoice?.date !== "string")
      simpleError(
        `invoices.${index}.date`,
        "Every invoice must have a date in YYYY-MM-DD format.",
        "invalid_invoice_date",
      );
    validateInvoiceDate(invoice.date, `invoices.${index}.date`);
    if (typeof invoice?.vendor !== "string" || invoice.vendor.trim() === "")
      simpleError(
        `invoices.${index}.vendor`,
        "Every invoice must have a nonempty vendor name.",
        "invalid_invoice_vendor",
      );
  }

  const groups = new Map<string, number[]>();
  for (const [index, invoice] of input.invoices.entries()) {
    const key = matchKey(invoice);
    const group = groups.get(key);
    if (group === undefined) groups.set(key, [index]);
    else group.push(index);
  }
  const duplicateIndices = [...groups.values()].filter(
    (group) => group.length > 1,
  );
  return {
    duplicateGroups: duplicateIndices.length,
    duplicateIndices,
    duplicates: duplicateIndices.reduce((sum, group) => sum + group.length, 0),
  };
};

export const sameDayDuplicateInvoiceExample = {
  input: {
    invoices: [
      { amount: 1200, date: "2026-03-04", vendor: "Acme Supply" },
      { amount: 950, date: "2026-03-04", vendor: "Acme Supply" },
      { amount: 1200, date: "2026-03-04", vendor: "acme supply " },
    ],
  },
  output: {
    duplicateGroups: 1,
    duplicateIndices: [[0, 2]],
    duplicates: 2,
  },
} satisfies ToolExample<
  SameDayDuplicateInvoiceInput,
  SameDayDuplicateInvoiceOutput
>;

const executeSameDayDuplicateInvoice = (
  input: unknown,
): ToolResult<SameDayDuplicateInvoiceOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const unknownField = Object.keys(input).find((field) => field !== "invoices");
  if (unknownField !== undefined)
    return invalidInput([
      {
        code: "unknown_field",
        field: unknownField,
        message: `${unknownField} is not a supported input field.`,
      },
    ]);
  if (!Array.isArray(input.invoices))
    return invalidInput([
      {
        code: "invoices_required",
        field: "invoices",
        message: "Invoices must be an array.",
      },
    ]);
  if (input.invoices.length > toolResourceLimits.generatedValues)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "invoices",
        message: `Invoices must not contain more than ${toolResourceLimits.generatedValues} entries.`,
      },
    ]);

  const invoices: SameDayDuplicateInvoice[] = [];
  for (const [index, invoice] of input.invoices.entries()) {
    if (!isRecord(invoice))
      return invalidInput([
        {
          code: "invalid_invoice",
          field: `invoices.${index}`,
          message: "Each invoice must be an object.",
        },
      ]);
    const unknownInvoiceField = Object.keys(invoice).find(
      (field) => field !== "amount" && field !== "date" && field !== "vendor",
    );
    if (unknownInvoiceField !== undefined)
      return invalidInput([
        {
          code: "unknown_field",
          field: `invoices.${index}.${unknownInvoiceField}`,
          message: `${unknownInvoiceField} is not a supported invoice field.`,
        },
      ]);
    if (typeof invoice.amount !== "number" || !Number.isFinite(invoice.amount))
      return invalidInput([
        {
          code: "invalid_invoice_amount",
          field: `invoices.${index}.amount`,
          message: "Every invoice must have a finite amount.",
        },
      ]);
    if (typeof invoice.date !== "string")
      return invalidInput([
        {
          code: "invalid_invoice_date",
          field: `invoices.${index}.date`,
          message: "Every invoice must have a date in YYYY-MM-DD format.",
        },
      ]);
    if (typeof invoice.vendor !== "string" || invoice.vendor.trim() === "")
      return invalidInput([
        {
          code: "invalid_invoice_vendor",
          field: `invoices.${index}.vendor`,
          message: "Every invoice must have a nonempty vendor name.",
        },
      ]);
    invoices.push({
      amount: invoice.amount,
      date: invoice.date,
      vendor: invoice.vendor,
    });
  }

  try {
    return toolSuccess(findSameDayDuplicateInvoices({ invoices }));
  } catch (error) {
    if (error instanceof SimpleToolError)
      return invalidInput([
        { code: error.code, field: error.field, message: error.message },
      ]);
    throw error;
  }
};

export const sameDayDuplicateInvoiceTool = defineTool<
  SameDayDuplicateInvoiceInput,
  SameDayDuplicateInvoiceOutput
>({
  contractVersion: 1,
  description:
    "Flag groups of invoices that share the same case-insensitive trimmed vendor, exact finite amount, and calendar date.",
  execute: executeSameDayDuplicateInvoice,
  execution: { kind: "pure" },
  id: "auditing/same-day-duplicate-invoice-exact-match-flagger",
  inputSchema: {
    additionalProperties: false,
    properties: {
      invoices: {
        description:
          "Invoices to scan; vendor comparison is case-insensitive and ignores surrounding spaces, while amounts and dates must match exactly.",
        items: {
          additionalProperties: false,
          properties: {
            amount: { type: "number" },
            date: { format: "date", type: "string" },
            vendor: { minLength: 1, pattern: "\\S", type: "string" },
          },
          required: ["amount", "date", "vendor"],
          type: "object",
        },
        maxItems: toolResourceLimits.generatedValues,
        type: "array",
      },
    },
    required: ["invoices"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      duplicateGroups: { minimum: 0, type: "integer" },
      duplicateIndices: {
        items: {
          items: { minimum: 0, type: "integer" },
          minItems: 2,
          type: "array",
        },
        type: "array",
      },
      duplicates: { minimum: 0, type: "integer" },
    },
    required: ["duplicateGroups", "duplicateIndices", "duplicates"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "invoices",
        label: "Invoices",
        required: true,
        valueType: {
          format: "invoice-match-record",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "duplicateGroups",
        label: "Duplicate groups",
        valueType: { type: "integer" },
      },
      {
        id: "duplicateIndices",
        label: "Duplicate index groups",
        valueType: {
          items: { items: { type: "integer" }, type: "list" },
          type: "list",
        },
      },
      {
        description: "Total invoices belonging to duplicate groups.",
        id: "duplicates",
        label: "Duplicate invoices",
        valueType: { type: "integer" },
      },
    ],
  },
  title: "Same-Day Duplicate Invoice Exact-Match Flagger",
});

export const runSameDayDuplicateInvoice = sameDayDuplicateInvoiceTool.execute;
export default sameDayDuplicateInvoiceTool;
