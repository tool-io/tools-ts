import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly quotedListRatePerCarat: number;
  readonly stoneCaratMass: number;
  readonly negotiatedDiscountFraction: number;
  readonly transactionCurrencyPerQuoteCurrency: number;
  readonly transactionTaxFraction: number;
}>;
export type Output = Readonly<{
  readonly discountedNetTransactionQuote: number;
  readonly transactionTaxAmount: number;
  readonly totalTransactionQuote: number;
}>;
const inputFields = [
  {
    id: "quotedListRatePerCarat",
    label: "Quoted list rate per carat",
    kind: "number",
  },
  { id: "stoneCaratMass", label: "Stone carat mass", kind: "number" },
  {
    id: "negotiatedDiscountFraction",
    label: "Negotiated discount fraction",
    kind: "number",
  },
  {
    id: "transactionCurrencyPerQuoteCurrency",
    label: "Transaction currency per quote currency",
    kind: "number",
  },
  {
    id: "transactionTaxFraction",
    label: "Transaction tax fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.transactionCurrencyPerQuoteCurrency,
    "transactionCurrencyPerQuoteCurrency",
  );
  nonnegative(input.quotedListRatePerCarat, "quotedListRatePerCarat");
  nonnegative(input.stoneCaratMass, "stoneCaratMass");
  nonnegative(input.transactionTaxFraction, "transactionTaxFraction");
  fraction(input.negotiatedDiscountFraction, "negotiatedDiscountFraction");
  const discountedNetTransactionQuote =
      input.quotedListRatePerCarat *
      input.stoneCaratMass *
      (1 - input.negotiatedDiscountFraction) *
      input.transactionCurrencyPerQuoteCurrency,
    transactionTaxAmount =
      discountedNetTransactionQuote * input.transactionTaxFraction;
  return {
    discountedNetTransactionQuote,
    transactionTaxAmount,
    totalTransactionQuote: discountedNetTransactionQuote + transactionTaxAmount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  quotedListRatePerCarat: 100,
  stoneCaratMass: 2,
  negotiatedDiscountFraction: 0.2,
  transactionCurrencyPerQuoteCurrency: 2,
  transactionTaxFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  discountedNetTransactionQuote: 320,
  transactionTaxAmount: 32,
  totalTransactionQuote: 352,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/rap-discount-application",
  title: "Rap List Discount Application",
  description:
    "Apply caller supplied dated list quotation, negotiated discount, currency conversion and transaction tax; no proprietary Rap list publication, current rates or tax/legal compliance assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "discountedNetTransactionQuote",
      label: "Discounted net transaction quote",
      kind: "number",
    },
    {
      id: "transactionTaxAmount",
      label: "Transaction tax amount",
      kind: "number",
    },
    {
      id: "totalTransactionQuote",
      label: "Total transaction quote",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      quotedListRatePerCarat: value.quotedListRatePerCarat as number,
      stoneCaratMass: value.stoneCaratMass as number,
      negotiatedDiscountFraction: value.negotiatedDiscountFraction as number,
      transactionCurrencyPerQuoteCurrency:
        value.transactionCurrencyPerQuoteCurrency as number,
      transactionTaxFraction: value.transactionTaxFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
