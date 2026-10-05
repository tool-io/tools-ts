import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalDate: string;
  readonly expiryDate: string;
  readonly minimumRemainingDays: number;
};
export type Output = {
  readonly remainingDays: number;
  readonly marginDays: number;
  readonly meetsSuppliedMinimum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalDate: { type: "string", maxLength: 8192 },
    expiryDate: { type: "string", maxLength: 8192 },
    minimumRemainingDays: { type: "integer", minimum: 0 },
  },
  required: ["arrivalDate", "expiryDate", "minimumRemainingDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDays: { type: "integer" },
    marginDays: { type: "integer" },
    meetsSuppliedMinimum: { type: "boolean" },
  },
  required: ["remainingDays", "marginDays", "meetsSuppliedMinimum"],
} as const;
/** Compare arrival-to-expiry calendar days with an explicit remaining-shelf-life requirement without selecting a product safety rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalDate, expiryDate, minimumRemainingDays } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    (H.domain(
      Number.isSafeInteger(minimumRemainingDays) &&
        minimumRemainingDays >= 0 &&
        minimumRemainingDays <= Number.MAX_SAFE_INTEGER,
      "minimumRemainingDays",
    ),
      minimumRemainingDays);
    const remainingDays =
      (namedDate(expiryDate, "expiryDate").getTime() -
        namedDate(arrivalDate, "arrivalDate").getTime()) /
      86400000;
    return {
      remainingDays,
      marginDays: remainingDays - minimumRemainingDays,
      meetsSuppliedMinimum: remainingDays >= minimumRemainingDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arrivalDate: "2026-11-01",
    expiryDate: "2026-12-01",
    minimumRemainingDays: 14,
  },
  output: { remainingDays: 30, marginDays: 16, meetsSuppliedMinimum: true },
} satisfies ToolExample<Input, Output>;
export const stockShelfLifeArrivalMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/stock-shelf-life-arrival-margin",
    title: "Stock Shelf Life Arrival Margin Tool",
    description:
      "Compare arrival-to-expiry calendar days with an explicit remaining-shelf-life requirement without selecting a product safety rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalDate: { type: "string", maxLength: 8192 },
        expiryDate: { type: "string", maxLength: 8192 },
        minimumRemainingDays: { type: "integer", minimum: 0 },
      },
      required: ["arrivalDate", "expiryDate", "minimumRemainingDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDays: { type: "integer" },
        marginDays: { type: "integer" },
        meetsSuppliedMinimum: { type: "boolean" },
      },
      required: ["remainingDays", "marginDays", "meetsSuppliedMinimum"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalDate",
          label: "Arrival Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "minimumRemainingDays",
          label: "Minimum Remaining Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        {
          id: "marginDays",
          label: "Margin Days",
          valueType: { type: "integer" },
        },
        {
          id: "meetsSuppliedMinimum",
          label: "Meets Supplied Minimum",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stockShelfLifeArrivalMarginTool.execute;
export default stockShelfLifeArrivalMarginTool;
