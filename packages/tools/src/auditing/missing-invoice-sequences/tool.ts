import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly invoiceNumbers: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingNumbers: readonly number[];
  readonly missingCount: number;
  readonly firstNumber: number;
  readonly lastNumber: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.invoiceNumbers.length === 0 ||
    !input.invoiceNumbers.every(Number.isSafeInteger)
  )
    simpleError(
      "invoiceNumbers",
      "Invoice numbers must be a nonempty list of safe integers.",
      "invalid_sequence",
    );
  const sorted = [...new Set(input.invoiceNumbers)].sort((a, b) => a - b);
  const missingNumbers: number[] = [];
  for (let value = sorted[0]; value <= sorted[sorted.length - 1]; value += 1)
    if (!sorted.includes(value)) missingNumbers.push(value);
  return {
    missingNumbers,
    missingCount: missingNumbers.length,
    firstNumber: sorted[0],
    lastNumber: sorted[sorted.length - 1],
  };
};

export const exampleInput = {
  invoiceNumbers: [1001, 1002, 1004, 1005],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = { invoiceNumbers: [7] } satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      invoiceNumbers: input.invoiceNumbers as readonly number[],
    }),
  description:
    "Find gaps inside the observed minimum-to-maximum invoice-number sequence.",
  id: "auditing/missing-invoice-sequences",
  inputs: [
    { id: "invoiceNumbers", label: "Invoice numbers", kind: "numberList" },
  ],
  outputs: [
    {
      id: "missingNumbers",
      label: "Missing invoice numbers",
      kind: "numberList",
    },
    { id: "missingCount", label: "Missing count", kind: "integer", minimum: 0 },
    { id: "firstNumber", label: "First number", kind: "integer" },
    { id: "lastNumber", label: "Last number", kind: "integer" },
  ],
  title: "Missing Invoice Sequences",
});

export const run = tool.execute;
export default tool;
