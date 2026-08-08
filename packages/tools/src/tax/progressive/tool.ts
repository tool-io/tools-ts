import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";

export type ProgressiveTaxBracket = {
  readonly rate: number;
  readonly upTo: number | null;
};

export type ProgressiveTaxInput = {
  readonly brackets: readonly ProgressiveTaxBracket[];
  readonly income: number;
};

export type ProgressiveTaxBand = {
  readonly from: number;
  readonly rate: number;
  readonly tax: number;
  readonly taxableAmount: number;
  readonly upTo: number | null;
};

export type ProgressiveTaxOutput = {
  readonly bands: readonly ProgressiveTaxBand[];
  readonly effectiveRate: number;
  readonly income: number;
  readonly marginalRate: number;
  readonly tax: number;
};

export const progressiveTaxExample = {
  input: {
    brackets: [
      { rate: 0, upTo: 12_000 },
      { rate: 0.2, upTo: 50_000 },
      { rate: 0.4, upTo: null },
    ],
    income: 100_000,
  },
  output: {
    bands: [
      { from: 0, rate: 0, tax: 0, taxableAmount: 12_000, upTo: 12_000 },
      {
        from: 12_000,
        rate: 0.2,
        tax: 7_600,
        taxableAmount: 38_000,
        upTo: 50_000,
      },
      {
        from: 50_000,
        rate: 0.4,
        tax: 20_000,
        taxableAmount: 50_000,
        upTo: null,
      },
    ],
    effectiveRate: 0.276,
    income: 100_000,
    marginalRate: 0.4,
    tax: 27_600,
  },
} satisfies ToolExample<ProgressiveTaxInput, ProgressiveTaxOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateProgressiveTax = (
  input: unknown,
): ToolResult<ProgressiveTaxOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const { brackets, income } = input;
  if (
    typeof income !== "number" ||
    !Number.isFinite(income) ||
    income < 0 ||
    !Array.isArray(brackets) ||
    brackets.length === 0 ||
    brackets.length > 1_000
  )
    return invalidInput([
      {
        code: "invalid_tax_schedule",
        field: "brackets",
        message:
          "Income and tax brackets must form a finite progressive schedule.",
      },
    ]);

  let lower = 0;
  for (const [index, bracket] of brackets.entries()) {
    if (
      !isRecord(bracket) ||
      typeof bracket.rate !== "number" ||
      !Number.isFinite(bracket.rate) ||
      bracket.rate < 0 ||
      bracket.rate > 1 ||
      (bracket.upTo !== null &&
        (typeof bracket.upTo !== "number" ||
          !Number.isFinite(bracket.upTo) ||
          bracket.upTo <= lower)) ||
      (bracket.upTo === null && index !== brackets.length - 1)
    )
      return invalidInput([
        {
          code: "invalid_tax_schedule",
          field: `brackets.${index}`,
          message:
            "Tax brackets must be ordered and end with an open upper band.",
        },
      ]);
    if (bracket.upTo !== null) lower = bracket.upTo as number;
  }
  if ((brackets.at(-1) as ProgressiveTaxBracket | undefined)?.upTo !== null)
    return invalidInput([
      {
        code: "open_final_band_required",
        field: "brackets",
        message: "The final tax bracket must have no upper limit.",
      },
    ]);

  lower = 0;
  let tax = 0;
  let marginalRate = (brackets[0] as ProgressiveTaxBracket).rate;
  const bands: ProgressiveTaxBand[] = [];
  for (const rawBracket of brackets) {
    const bracket = rawBracket as ProgressiveTaxBracket;
    const upper = bracket.upTo ?? income;
    const taxableAmount = Math.max(0, Math.min(income, upper) - lower);
    const bandTax = taxableAmount * bracket.rate;
    bands.push({
      from: lower,
      rate: bracket.rate,
      tax: bandTax,
      taxableAmount,
      upTo: bracket.upTo,
    });
    tax += bandTax;
    if (income <= upper) {
      marginalRate = bracket.rate;
      break;
    }
    lower = upper;
  }

  return toolSuccess({
    bands,
    effectiveRate: income === 0 ? 0 : tax / income,
    income,
    marginalRate,
    tax,
  });
};

export const progressiveTaxTool = defineTool<
  ProgressiveTaxInput,
  ProgressiveTaxOutput
>({
  contractVersion: 1,
  description:
    "Calculate total tax, tax bands, and effective and marginal rates from an explicit progressive schedule.",
  execute: calculateProgressiveTax,
  execution: { kind: "pure" },
  id: "tax/progressive",
  inputSchema: {
    additionalProperties: false,
    properties: {
      brackets: {
        items: {
          additionalProperties: false,
          properties: {
            rate: { maximum: 1, minimum: 0, type: "number" },
            upTo: { anyOf: [{ type: "number" }, { type: "null" }] },
          },
          required: ["rate", "upTo"],
          type: "object",
        },
        minItems: 1,
        type: "array",
      },
      income: { minimum: 0, type: "number" },
    },
    required: ["income", "brackets"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      bands: {
        items: {
          additionalProperties: false,
          properties: {
            from: { minimum: 0, type: "number" },
            rate: { maximum: 1, minimum: 0, type: "number" },
            tax: { minimum: 0, type: "number" },
            taxableAmount: { minimum: 0, type: "number" },
            upTo: { anyOf: [{ type: "number" }, { type: "null" }] },
          },
          required: ["from", "rate", "tax", "taxableAmount", "upTo"],
          type: "object",
        },
        type: "array",
      },
      effectiveRate: { minimum: 0, type: "number" },
      income: { minimum: 0, type: "number" },
      marginalRate: { minimum: 0, type: "number" },
      tax: { minimum: 0, type: "number" },
    },
    required: ["bands", "effectiveRate", "income", "marginalRate", "tax"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "income",
        label: "Taxable income",
        required: true,
        valueType: { format: "money", type: "number" },
      },
      {
        id: "brackets",
        label: "Tax brackets",
        required: true,
        valueType: {
          format: "tax/progressive-brackets",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "result",
        label: "Progressive tax result",
        path: [],
        valueType: { format: "tax/progressive-result", type: "object" },
      },
    ],
  },
  title: "Progressive Tax Calculator",
});

export default progressiveTaxTool;
