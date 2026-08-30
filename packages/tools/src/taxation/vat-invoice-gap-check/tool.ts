import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly invoiceNumbers: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingInvoiceNumbers: readonly number[];
  readonly duplicateInvoiceNumbers: readonly number[];
  readonly gapCount: number;
  readonly duplicateCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.invoiceNumbers.length === 0 ||
    input.invoiceNumbers.some(
      (value) => !Number.isSafeInteger(value) || value < 0,
    )
  )
    simpleError(
      "invoiceNumbers",
      "Invoice numbers must be nonnegative safe integers.",
      "invalid_numbers",
    );
  const sorted = [...input.invoiceNumbers].sort((a, b) => a - b);
  const duplicateInvoiceNumbers = [
    ...new Set(
      sorted.filter((value, index) => index > 0 && value === sorted[index - 1]),
    ),
  ];
  const missingInvoiceNumbers: number[] = [];
  for (let value = sorted[0]; value <= sorted[sorted.length - 1]; value += 1)
    if (!sorted.includes(value)) missingInvoiceNumbers.push(value);
  return {
    missingInvoiceNumbers,
    duplicateInvoiceNumbers,
    gapCount: missingInvoiceNumbers.length,
    duplicateCount: duplicateInvoiceNumbers.length,
  };
};

export const exampleInput = {
  invoiceNumbers: [100, 101, 101, 103],
} satisfies Input;
export const exampleOutput = {
  missingInvoiceNumbers: [102],
  duplicateInvoiceNumbers: [101],
  gapCount: 1,
  duplicateCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      invoiceNumbers: input.invoiceNumbers as readonly number[],
    }),
  description: "Find gaps and duplicates in supplied VAT invoice numbers.",
  id: "taxation/vat-invoice-gap-check",
  inputs: [
    { id: "invoiceNumbers", label: "Invoice numbers", kind: "numberList" },
  ],
  outputs: [
    {
      id: "missingInvoiceNumbers",
      label: "Missing invoice numbers",
      kind: "numberList",
    },
    {
      id: "duplicateInvoiceNumbers",
      label: "Duplicate invoice numbers",
      kind: "numberList",
    },
    {
      id: "gapCount",
      label: "Missing-number count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "duplicateCount",
      label: "Duplicate-number count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "VAT Invoice Gap Check",
});

export const run = tool.execute;
export default tool;
