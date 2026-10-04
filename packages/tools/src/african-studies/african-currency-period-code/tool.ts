import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currencyCode: string;
  readonly periodStartYear: number;
  readonly periodEndYear: number;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currencyCode: { type: "string", maxLength: 8192 },
    periodStartYear: { type: "integer", minimum: -100000, maximum: 9999 },
    periodEndYear: { type: "integer", maximum: 9999 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["currencyCode", "periodStartYear", "periodEndYear", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly sourced currency-period record without resolving historical currency facts or exchange rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currencyCode, periodStartYear, periodEndYear, source } = request;
  const compute = (): Output => {
    H.domain(currencyCode.length > 0 && source.length > 0, "currencyCode");
    (H.domain(
      Number.isSafeInteger(periodStartYear) &&
        periodStartYear >= -100000 &&
        periodStartYear <= 9999,
      "periodStartYear",
    ),
      periodStartYear);
    (H.domain(
      Number.isSafeInteger(periodEndYear) &&
        periodEndYear >= periodStartYear &&
        periodEndYear <= 9999,
      "periodEndYear",
    ),
      periodEndYear);
    return {
      label:
        currencyCode +
        " [" +
        periodStartYear +
        "–" +
        periodEndYear +
        "; " +
        source +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currencyCode: "recorded unit",
    periodStartYear: 1900,
    periodEndYear: 1920,
    source: "Ledger A",
  },
  output: { label: "recorded unit [1900–1920; Ledger A]" },
} satisfies ToolExample<Input, Output>;
export const africanCurrencyPeriodCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-currency-period-code",
    title: "African Currency Period Code Tool",
    description:
      "Label an explicitly sourced currency-period record without resolving historical currency facts or exchange rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currencyCode: { type: "string", maxLength: 8192 },
        periodStartYear: { type: "integer", minimum: -100000, maximum: 9999 },
        periodEndYear: { type: "integer", maximum: 9999 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["currencyCode", "periodStartYear", "periodEndYear", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "currencyCode",
          label: "Currency Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "periodStartYear",
          label: "Period Start Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodEndYear",
          label: "Period End Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = africanCurrencyPeriodCodeTool.execute;
export default africanCurrencyPeriodCodeTool;
