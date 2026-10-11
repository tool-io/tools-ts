import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceYear: number;
  readonly referenceMonth: number;
  readonly suppliedLagMonths: number;
};
export type Output = {
  readonly laggedYear: number;
  readonly laggedMonth: number;
  readonly monthLabel: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceYear: { type: "integer", minimum: 0, maximum: 9999 },
    referenceMonth: { type: "integer", minimum: 1, maximum: 12 },
    suppliedLagMonths: { type: "integer", minimum: 0 },
  },
  required: ["referenceYear", "referenceMonth", "suppliedLagMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    laggedYear: { type: "integer" },
    laggedMonth: { type: "integer" },
    monthLabel: { type: "string", maxLength: 8192 },
  },
  required: ["laggedYear", "laggedMonth", "monthLabel"],
} as const;
/** Shift an explicit lease index-reference month backward by a supplied month lag without looking up CPI or lease terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceYear, referenceMonth, suppliedLagMonths } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(referenceYear) &&
        referenceYear >= 0 &&
        referenceYear <= 9999,
      "referenceYear",
    ),
      referenceYear);
    (H.domain(
      Number.isSafeInteger(referenceMonth) &&
        referenceMonth >= 1 &&
        referenceMonth <= 12,
      "referenceMonth",
    ),
      referenceMonth);
    (H.domain(
      Number.isSafeInteger(suppliedLagMonths) &&
        suppliedLagMonths >= 0 &&
        suppliedLagMonths <= Number.MAX_SAFE_INTEGER,
      "suppliedLagMonths",
    ),
      suppliedLagMonths);
    return (() => {
      const total =
        BigInt(referenceYear) * 12n +
        BigInt(referenceMonth) -
        1n -
        BigInt(suppliedLagMonths);
      H.domain(total >= 0n && total < 120000n, "suppliedLagMonths");
      const laggedYear = Number(total / 12n),
        laggedMonth = Number(total % 12n) + 1;
      return {
        laggedYear,
        laggedMonth,
        monthLabel:
          String(laggedYear).padStart(4, "0") +
          "-" +
          String(laggedMonth).padStart(2, "0"),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceYear: 2026, referenceMonth: 11, suppliedLagMonths: 3 },
  output: { laggedYear: 2026, laggedMonth: 8, monthLabel: "2026-08" },
} satisfies ToolExample<Input, Output>;
export const leaseCpiReferenceLagMonthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/lease-cpi-reference-lag-month",
    title: "Lease Cpi Reference Lag Month",
    description:
      "Shift an explicit lease index-reference month backward by a supplied month lag without looking up CPI or lease terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceYear: { type: "integer", minimum: 0, maximum: 9999 },
        referenceMonth: { type: "integer", minimum: 1, maximum: 12 },
        suppliedLagMonths: { type: "integer", minimum: 0 },
      },
      required: ["referenceYear", "referenceMonth", "suppliedLagMonths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laggedYear: { type: "integer" },
        laggedMonth: { type: "integer" },
        monthLabel: { type: "string", maxLength: 8192 },
      },
      required: ["laggedYear", "laggedMonth", "monthLabel"],
    },
    ports: {
      inputs: [
        {
          id: "referenceYear",
          label: "Reference Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceMonth",
          label: "Reference Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedLagMonths",
          label: "Supplied Lag Months",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "laggedYear",
          label: "Lagged Year",
          valueType: { type: "integer" },
        },
        {
          id: "laggedMonth",
          label: "Lagged Month",
          valueType: { type: "integer" },
        },
        {
          id: "monthLabel",
          label: "Month Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = leaseCpiReferenceLagMonthTool.execute;
export default leaseCpiReferenceLagMonthTool;
