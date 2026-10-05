import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountText: string;
  readonly denomination: string;
  readonly place: string;
  readonly year: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountText: { type: "string", maxLength: 8192 },
    denomination: { type: "string", maxLength: 8192 },
    place: { type: "string", maxLength: 8192 },
    year: { type: "integer", minimum: -100000, maximum: 9999 },
  },
  required: ["amountText", "denomination", "place", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record historical money wording with an explicit place and year context; no exchange-rate or denomination conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountText, denomination, place, year } = request;
  const compute = (): Output => {
    H.domain(
      amountText.length > 0 && denomination.length > 0 && place.length > 0,
      "amountText",
    );
    (H.domain(
      Number.isSafeInteger(year) && year >= -100000 && year <= 9999,
      "year",
    ),
      year);
    return {
      label: amountText + " " + denomination + " [" + place + ", " + year + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amountText: "12",
    denomination: "shillings",
    place: "London",
    year: 1750,
  },
  output: { label: "12 shillings [London, 1750]" },
} satisfies ToolExample<Input, Output>;
export const historicalMoneyDenominationRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-money-denomination-record",
    title: "Historical Money Denomination Record Tool",
    description:
      "Record historical money wording with an explicit place and year context; no exchange-rate or denomination conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountText: { type: "string", maxLength: 8192 },
        denomination: { type: "string", maxLength: 8192 },
        place: { type: "string", maxLength: 8192 },
        year: { type: "integer", minimum: -100000, maximum: 9999 },
      },
      required: ["amountText", "denomination", "place", "year"],
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
          id: "amountText",
          label: "Amount Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denomination",
          label: "Denomination",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "place",
          label: "Place",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalMoneyDenominationRecordTool.execute;
export default historicalMoneyDenominationRecordTool;
